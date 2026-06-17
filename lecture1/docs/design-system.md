# 디자인 시스템 가이드

## MUI (Material-UI) 기반 디자인 시스템

### 컬러 팔레트
- **Primary**: `#1976d2` (파란색 계열)
- **Secondary**: `#dc004e` (분홍/빨간 계열)
- **Error**: `#d32f2f`
- **Warning**: `#ed6c02`
- **Success**: `#2e7d32`

### 타이포그래피
- **기본 폰트**: Roboto
- **h1**: 2.125rem / 500 weight
- **h2**: 1.5rem / 500 weight
- **body1**: 1rem / 400 weight
- **body2**: 0.875rem / 400 weight

### 간격 시스템
- 기본 spacing 단위: 8px
- `theme.spacing(1)` = 8px
- `theme.spacing(2)` = 16px

### 컴포넌트 사용 원칙
- Button: variant="contained" | "outlined" | "text"
- TextField: variant="outlined" 기본 사용
- Card: elevation 사용하여 깊이 표현
- Grid: 12 컬럼 그리드 시스템 활용

### 반응형 브레이크포인트
- xs: 0px ~
- sm: 600px ~
- md: 900px ~
- lg: 1200px ~
- xl: 1536px ~

### 아이콘 사용
```jsx
import HomeIcon from '@mui/icons-material/Home';
<HomeIcon fontSize="small" | "medium" | "large" />
```
