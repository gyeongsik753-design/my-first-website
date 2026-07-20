-- ============================================================
-- WITF (Where Is The Fit) — 패션 커뮤니티 DB 스키마
-- Supabase SQL Editor에서 이 파일 전체를 실행하세요.
-- ============================================================
--
-- ⚠️ 기획안과 다른 부분 안내
-- 기획안에는 users 테이블에 "비밀번호" 컬럼이 있었지만,
-- 이 프로젝트는 프론트엔드에서 anon key로 DB에 직접 접근하는 구조라
-- 비밀번호를 테이블에 평문으로 저장하면 누구나 조회할 수 있어 위험합니다.
-- 그래서 비밀번호는 Supabase Auth(자체 보안 저장소)가 관리하고,
-- users 테이블은 "이름/이메일/전화번호/가입일" 같은 프로필 정보만
-- auth 사용자와 1:1로 연결해서 저장하는 방식으로 구현했습니다.
-- (회원가입 화면에서 이름/이메일/비밀번호/전화번호를 입력받는 것은 동일합니다)
-- ============================================================

-- 1. users (프로필) 테이블
-- id는 Supabase Auth의 auth.users.id 를 그대로 사용합니다 (1:1 연결)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- 2. posts (게시물) 테이블
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null,
  image_url text,
  author_id uuid not null references public.users (id) on delete cascade,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. comments (댓글) 테이블
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  content text not null,
  author_id uuid not null references public.users (id) on delete cascade,
  post_id bigint not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 4. likes (좋아요) 테이블 — 기획안의 "좋아요 수" 기능을 위해 추가
create table if not exists public.likes (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists likes_post_id_idx on public.likes (post_id);

-- ============================================================
-- 회원가입 시 auth.users -> public.users 자동 동기화 트리거
-- (회원가입 화면에서 입력한 이름/전화번호를 auth metadata로 넘기면
--  가입과 동시에 프로필 행이 자동 생성됩니다)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 조회수 증가 RPC (게시물 상세 페이지 진입 시 호출)
-- ============================================================
create or replace function public.increment_post_view(post_id_input bigint)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.posts set view_count = view_count + 1 where id = post_id_input;
end;
$$;

-- ============================================================
-- RLS (Row Level Security) 활성화
-- ============================================================
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- users: 누구나 프로필(이름) 조회 가능, 본인 행만 수정 가능
create policy "users_select_all" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- posts: 누구나 조회 가능, 로그인한 사용자만 작성, 본인 글만 수정/삭제
create policy "posts_select_all" on public.posts for select using (true);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = author_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = author_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = author_id);

-- comments: 누구나 조회 가능, 로그인한 사용자만 작성, 본인 댓글만 삭제
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = author_id);

-- likes: 누구나 조회(좋아요 수 집계) 가능, 로그인한 사용자만 본인 좋아요 추가/삭제
create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- ============================================================
-- Storage: 게시물 사진 업로드용 public 버킷
-- ============================================================
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "post_images_public_read" on storage.objects
  for select using (bucket_id = 'post-images');

create policy "post_images_auth_upload" on storage.objects
  for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "post_images_owner_delete" on storage.objects
  for delete using (bucket_id = 'post-images' and auth.uid() = owner);
