-- ============================================================
-- WITF mini_sns — 패션 SNS DB 스키마
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 실행하세요.
-- ============================================================
--
-- ⚠️ 기획안과 다른 부분 안내
-- 기획안에는 users 테이블에 "비밀번호" 컬럼이 있었지만, 이 프로젝트는
-- 프론트엔드에서 anon key로 DB에 직접 접근하는 구조라 비밀번호를 테이블에
-- 평문으로 저장하면 누구나 조회할 수 있어 위험합니다. 그래서 비밀번호는
-- Supabase Auth(자체 보안 저장소)가 관리하고, users 테이블은
-- 사용자명/이메일/표시이름/소개글/프로필사진/가입일 같은 프로필 정보만
-- auth 사용자와 1:1로 연결해서 저장합니다. 회원가입 화면에서 입력받는
-- 항목(이메일/비밀번호/사용자명/표시이름)은 기획안과 동일합니다.
-- ============================================================

-- 1. users (프로필) 테이블 — id는 auth.users.id 를 그대로 사용 (1:1 연결)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  email text not null,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 2. posts (게시물) 테이블
-- 기획안대로 좋아요는 별도 테이블 없이 likes_count 필드로만 관리합니다.
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  caption text not null,
  image_url text not null,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. comments (댓글) 테이블
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  content text not null,
  author_id uuid not null references public.users (id) on delete cascade,
  post_id bigint not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists posts_user_id_idx on public.posts (user_id);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id);

-- ============================================================
-- 회원가입 시 auth.users -> public.users 자동 동기화 트리거
-- (회원가입 화면에서 입력한 username/display_name을 auth metadata로 넘기면
--  가입과 동시에 프로필 행이 자동 생성됩니다)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, email, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 좋아요 증감 RPC
-- 팔로우/좋아요 여부를 담는 별도 테이블이 없기 때문에(기획안 반영),
-- UPDATE 권한을 테이블 전체에 열어주는 대신 likes_count만 안전하게
-- +1 / -1 하는 함수로만 값이 바뀌도록 제한합니다.
-- (중복 클릭 방지는 프론트에서 localStorage로 처리)
-- ============================================================
create or replace function public.increment_post_likes(post_id_input bigint)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.posts set likes_count = likes_count + 1 where id = post_id_input;
end;
$$;

create or replace function public.decrement_post_likes(post_id_input bigint)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.posts set likes_count = greatest(likes_count - 1, 0) where id = post_id_input;
end;
$$;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- users: 누구나 프로필 조회 가능(피드에 작성자 표시), 본인 행만 수정 가능
create policy "users_select_all" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- posts: 누구나 조회 가능, 로그인한 사용자만 작성, 본인 글만 수정/삭제
create policy "posts_select_all" on public.posts for select using (true);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

-- comments: 누구나 조회 가능, 로그인한 사용자만 작성, 본인 댓글만 삭제
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = author_id);
