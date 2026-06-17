# 새 프로젝트 빠른 시작 가이드

## _template_settings 활용한 프로젝트 생성

### 1단계: 템플릿 복사
```bash
# lecture1 디렉토리에서 실행
cp -r _template_settings [새프로젝트명]
cd [새프로젝트명]
```

### 2단계: package.json 업데이트
```json
{
  "name": "[새프로젝트명]",
  "version": "0.0.0"
}
```

### 3단계: 기존 코드 초기화
```bash
# src/App.jsx를 원하는 내용으로 교체
# src/App.css 내용 비우기
```

### 4단계: 개발 서버 실행
```bash
npm run dev
# http://localhost:5173 에서 확인
```

## 포함된 패키지

| 패키지 | 용도 |
|--------|------|
| react | UI 라이브러리 |
| react-dom | DOM 렌더링 |
| react-router-dom | 클라이언트 라우팅 |
| @mui/material | Material-UI 컴포넌트 |
| @emotion/react | MUI 스타일 엔진 |
| @emotion/styled | styled-component 지원 |
| @mui/icons-material | MUI 아이콘 |
| @fontsource/roboto | Roboto 웹폰트 |

## 기본 라우팅 설정 예시

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## MUI 컴포넌트 빠른 사용법

```jsx
import { Button, TextField, Box, Typography } from '@mui/material';

function MyPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        페이지 제목
      </Typography>
      <TextField label="입력" variant="outlined" fullWidth />
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        버튼
      </Button>
    </Box>
  );
}
```
