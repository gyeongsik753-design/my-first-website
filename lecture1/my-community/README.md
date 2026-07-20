# WITF (Where Is The Fit)

패션 OOTD 커뮤니티. React + Vite + MUI + Supabase로 구현했습니다.

## 로컬 개발

1. Supabase 프로젝트를 만들고 `supabase/schema.sql`을 SQL Editor에서 실행하세요.
2. `.env.example`을 복사해 `.env`를 만들고 Project URL / anon key를 채워주세요.
   ```
   cp .env.example .env
   ```
3. 의존성 설치 후 개발 서버 실행
   ```
   npm install
   npm run dev
   ```

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드 후
GitHub Pages(`https://gyeongsik753-design.github.io/my-first-website/`)에 배포합니다.
GitHub 저장소 Settings > Secrets and variables > Actions에 아래 두 값을 등록해야 합니다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 주요 기능

- 이메일/비밀번호 회원가입·로그인 (Supabase Auth)
- 게시물 목록 (페이지네이션, 작성자/제목/사진/작성일)
- 게시물 상세 (본문, 조회수, 좋아요, 댓글)
- 댓글 작성
- 사진 업로드 (Supabase Storage)
