# WITF mini_sns

Where Is The Fit — 패션 OOTD 공유 미니 SNS. React + Vite + MUI + Supabase + Unsplash API로 구현했습니다.

## 로컬 개발

1. Supabase 프로젝트를 만들고 `supabase/schema.sql`을 SQL Editor에서 실행하세요.
2. [unsplash.com/developers](https://unsplash.com/developers)에서 앱을 만들고 Access Key를 발급받으세요.
3. `.env.example`을 복사해 `.env`를 만들고 값을 채워주세요.
   ```
   cp .env.example .env
   ```
4. 의존성 설치 후 개발 서버 실행
   ```
   npm install
   npm run dev
   ```

## 배포

GitHub Actions는 저장소 루트의 `.github/workflows/`만 인식하므로, 실제 배포 워크플로우는
이 폴더가 아니라 저장소 루트의 `/.github/workflows/deploy.yml`에 있습니다
(`lecture1/mini_sns/**` 경로 변경 시에만 트리거). `main` 브랜치에 push하면 자동으로 빌드 후
GitHub Pages(`https://gyeongsik753-design.github.io/my-first-website/`)에 배포합니다.
이 저장소는 여러 프로젝트가 GitHub Pages 하나를 공유하므로, 배포될 때마다 그 시점에
빌드된 프로젝트만 보입니다.

GitHub 저장소 Settings > Secrets and variables > Actions에 아래 값들을 등록해야 합니다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_UNSPLASH_ACCESS_KEY`

## 주요 기능

- 이메일/비밀번호 회원가입·로그인 (Supabase Auth)
- 홈 피드 (검색, "오늘의 코디 올리기" 유도 배너)
- 게시물 상세 (좋아요, 댓글)
- 게시물 작성 (캡션 입력 → Unsplash 랜덤 이미지 중 선택)
- 마이페이지 (프로필/소개글 편집, 내 게시물 그리드, 로그아웃)
- 하단 내비게이션: 왼쪽 홈 · 가운데 작성 · 오른쪽 마이페이지·설정
