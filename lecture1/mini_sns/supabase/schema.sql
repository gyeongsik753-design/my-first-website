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
  category text not null default 'OOTD',
  brands text[] not null default '{}',
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 기존에 이미 posts 테이블이 만들어져 있던 경우를 위한 컬럼 추가
alter table public.posts add column if not exists category text not null default 'OOTD';
alter table public.posts add column if not exists brands text[] not null default '{}';

create index if not exists posts_category_idx on public.posts (category);

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

-- 4. conversations (1:1 DM 대화방) 테이블
-- user_a < user_b로 항상 정렬해서 저장 -> 두 사람 사이의 대화방이 중복 생성되지 않도록 함
create table if not exists public.conversations (
  id bigint generated always as identity primary key,
  user_a uuid not null references public.users (id) on delete cascade,
  user_b uuid not null references public.users (id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversations_user_order check (user_a < user_b),
  constraint conversations_unique_pair unique (user_a, user_b)
);

create index if not exists conversations_user_a_idx on public.conversations (user_a);
create index if not exists conversations_user_b_idx on public.conversations (user_b);

-- 5. messages (DM 메시지) 테이블
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_created_at_idx on public.messages (created_at);

-- 두 사용자 사이의 대화방을 찾거나 없으면 새로 만드는 RPC.
-- user_a/user_b 정렬 및 "본인끼리 대화 금지"를 서버에서 강제하기 위해
-- 클라이언트가 conversations 테이블에 직접 insert하지 않고 이 함수를 통해서만 생성합니다.
create or replace function public.get_or_create_conversation(other_user_id uuid)
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  me uuid := auth.uid();
  ua uuid;
  ub uuid;
  conv_id bigint;
begin
  if me is null then
    raise exception '로그인이 필요합니다';
  end if;
  if me = other_user_id then
    raise exception '자기 자신과는 대화할 수 없습니다';
  end if;

  if me < other_user_id then
    ua := me; ub := other_user_id;
  else
    ua := other_user_id; ub := me;
  end if;

  select id into conv_id from public.conversations where user_a = ua and user_b = ub;

  if conv_id is null then
    insert into public.conversations (user_a, user_b) values (ua, ub) returning id into conv_id;
  end if;

  return conv_id;
end;
$$;

-- 메시지가 새로 생기면 대화방의 last_message_at을 갱신 (목록 정렬용)
create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_inserted on public.messages;
create trigger on_message_inserted
  after insert on public.messages
  for each row execute procedure public.touch_conversation_on_message();

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
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

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

-- conversations: 본인이 참여한 대화방만 조회 가능. 생성은 get_or_create_conversation
-- RPC(security definer)를 통해서만 이뤄지므로 별도의 insert 정책은 두지 않습니다.
create policy "conversations_select_own" on public.conversations
  for select using (auth.uid() = user_a or auth.uid() = user_b);

-- messages: 본인이 참여한 대화방의 메시지만 조회/작성 가능
create policy "messages_select_own" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

create policy "messages_insert_own" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

-- 실시간 채팅을 위해 messages 테이블 변경 사항을 Realtime에 브로드캐스트
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- Storage: 게시물 사진 직접 업로드용 public 버킷
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
