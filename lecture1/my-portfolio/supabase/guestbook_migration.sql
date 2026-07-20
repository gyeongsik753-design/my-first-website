-- ============================================================
-- 포트폴리오 방명록(guestbook) 마이그레이션
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 실행하세요.
-- 이미 guestbook 테이블이 있어도 안전하게 재실행할 수 있습니다(IF NOT EXISTS 사용).
-- ============================================================

-- 혹시 테이블이 아예 없는 상태라면 기본 골격을 생성합니다.
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null,
  email text,
  organization text,
  referral text,
  emoji text,
  message text not null,
  created_at timestamptz not null default now()
);

-- 신규 필드: 전화번호(비공개), 좋아요 카운트
alter table public.guestbook add column if not exists phone text;
alter table public.guestbook add column if not exists likes integer not null default 0;

-- ============================================================
-- 좋아요 증가 RPC
-- 방명록은 별도 로그인이 없는 익명 게시판이라 "누가 눌렀는지" 구분이 불가능합니다.
-- 그래서 UPDATE 권한을 테이블 전체에 열어주는 대신, likes만 안전하게 +1 하는
-- 함수 하나만 만들어서 그 함수를 통해서만 좋아요 수가 바뀌도록 제한합니다.
-- (프론트에서는 localStorage로 중복 클릭만 막아줍니다)
-- ============================================================
create or replace function public.increment_guestbook_like(entry_id bigint)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.guestbook set likes = likes + 1 where id = entry_id;
end;
$$;

-- ============================================================
-- RLS: 누구나 조회/작성 가능, 수정/삭제는 불가(좋아요는 위 RPC로만 처리)
-- ============================================================
alter table public.guestbook enable row level security;

drop policy if exists "guestbook_select_all" on public.guestbook;
create policy "guestbook_select_all" on public.guestbook for select using (true);

drop policy if exists "guestbook_insert_all" on public.guestbook;
create policy "guestbook_insert_all" on public.guestbook for insert with check (true);

-- email, phone은 비공개 항목이므로 목록 조회 시 프론트엔드에서 절대 select하지 않습니다.
-- (RLS로 컬럼 단위 차단은 안 되기 때문에, 클라이언트 select 절에서 명시적으로 제외하는 방식으로 보호합니다)
