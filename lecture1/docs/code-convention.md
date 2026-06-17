# 코드 컨벤션 가이드

## 파일 및 디렉토리 구조
```
src/
├── components/     # 재사용 컴포넌트
├── pages/          # 페이지 컴포넌트
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── theme.js        # MUI 테마 설정
└── main.jsx        # 앱 진입점
```

## 컴포넌트 작성 규칙

### 함수형 컴포넌트 사용
```jsx
// 올바른 예
const MyComponent = ({ title, onClick }) => {
  return <div onClick={onClick}>{title}</div>;
};
export default MyComponent;
```

### Props 구조분해할당
```jsx
// 올바른 예
const Button = ({ label, color = 'primary', onClick }) => { ... };
```

### 이벤트 핸들러 네이밍
- 함수: `handle` + 동작명 (예: `handleClick`, `handleSubmit`)
- Props: `on` + 동작명 (예: `onClick`, `onSubmit`)

## 스타일링 규칙

### MUI sx prop 우선 사용
```jsx
<Box sx={{ display: 'flex', gap: 2, p: 3 }}>
```

### 인라인 스타일 지양
```jsx
// 나쁜 예
<div style={{ marginTop: '16px' }}>

// 좋은 예
<Box sx={{ mt: 2 }}>
```

## import 순서
1. React, React 관련 라이브러리
2. 서드파티 라이브러리 (MUI 등)
3. 내부 컴포넌트/유틸리티
4. 스타일 파일

```jsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MyComponent from './MyComponent';
```

## 네이밍 컨벤션
- 컴포넌트: PascalCase (예: `UserProfile`)
- 변수/함수: camelCase (예: `getUserData`)
- 상수: UPPER_SNAKE_CASE (예: `MAX_COUNT`)
- CSS 클래스: kebab-case (예: `user-profile`)
