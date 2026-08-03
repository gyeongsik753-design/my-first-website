import { createTheme } from '@mui/material/styles';

// WITF mini_sns — 힙하고 개성있는 패션 SNS 테마
// 메인: 그레이/화이트 · 보조: 빨강 (스트릿 다크 테마)
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#333333',
      paper: '#3d3d3d',
    },
    primary: {
      main: '#f5f5f5',
      contrastText: '#111111',
    },
    secondary: {
      main: '#E1263F',
    },
    text: {
      primary: '#f2f2f2',
      secondary: 'rgba(242, 242, 242, 0.62)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    error: {
      main: '#E1263F',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.2rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  spacing: 8,
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#f2f2f2',
          boxShadow: 'none',
          borderBottom: 'none',
        },
      },
    },
  },
});

export default theme;
