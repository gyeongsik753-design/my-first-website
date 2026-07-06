import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';

const NAV_ITEMS = [
  { label: 'Home',     path: '/',        subLabel: '홈' },
  { label: 'About Me', path: '/about',   subLabel: '소개' },
  { label: 'Projects', path: '/projects', subLabel: '프로젝트' },
];

/* ════════════════════════════════════
   햄버거 ↔ X 아이콘 (CSS transform)
════════════════════════════════════ */
const HamburgerIcon = ({ open }) => {
  /* 3선의 top, 열림 시 transform 정의 */
  const lines = [
    { top: 0,   openTransform: 'translateY(7px) rotate(45deg)'  },
    { top: 7,   openTransform: 'scaleX(0)',   openOpacity: 0     },
    { top: 14,  openTransform: 'translateY(-7px) rotate(-45deg)' },
  ];
  return (
    /* 22×16px 컨테이너 — 중심(11px, 8px)에서 교차 */
    <Box sx={{ width: 22, height: 16, position: 'relative' }} aria-hidden="true">
      {lines.map(({ top, openTransform, openOpacity }, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: 0, right: 0, top,
            height: 2, bgcolor: '#fff', borderRadius: 1,
            transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: open ? openTransform : 'none',
            opacity: open && openOpacity !== undefined ? openOpacity : 1,
          }}
        />
      ))}
    </Box>
  );
};

/* ════════════════════════════════════
   메인 Navbar
════════════════════════════════════ */
const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  /* 상태 */
  const [hidden,         setHidden]         = useState(false); // 헤더 숨김
  const [atTop,          setAtTop]          = useState(true);  // Hero 가시 여부
  const [scrollProgress, setScrollProgress] = useState(0);     // 읽기 진행률 0-100
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  const lastScrollY = useRef(0);

  /* ── 스크롤 이벤트: 진행률 + 방향 감지 ── */
  const handleScroll = useCallback(() => {
    const currentY  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    /* 읽기 진행률 */
    setScrollProgress(maxScroll > 0 ? (currentY / maxScroll) * 100 : 0);

    /* 방향 감지: 8px 임계치, 80px 이상 스크롤된 경우에만 숨김 */
    if (currentY > lastScrollY.current + 8 && currentY > 80) {
      setHidden(true);
    } else if (currentY < lastScrollY.current - 8 || currentY <= 80) {
      setHidden(false);
    }

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Intersection Observer: #hero 가시성 → 투명/불투명 전환 ── */
  useEffect(() => {
    const heroEl = document.getElementById('hero');

    if (!heroEl) {
      /* Hero 없는 페이지(About, Projects)는 항상 불투명 */
      setAtTop(false);
      return;
    }

    setAtTop(true); // 페이지 진입 시 초기화

    const obs = new IntersectionObserver(
      ([entry]) => setAtTop(entry.isIntersecting),
      { threshold: 0.05 }, // Hero의 5% 이상 보이면 투명
    );
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [location.pathname]); // 페이지 이동 시 재실행

  /* ── 데스크톱 전환 시 드로어 자동 닫기 ── */
  useEffect(() => {
    if (isDesktop) setDrawerOpen(false);
  }, [isDesktop]);

  /* ── 드로어 열릴 때 배경 스크롤 잠금 ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* 드로어 열림 + hidden일 경우 헤더 강제 표시 */
  const navbarHidden = hidden && !drawerOpen;

  return (
    <>
      {/* ════════════════════════════════════
          읽기 진행률 바 (항상 최상단 고정)
      ════════════════════════════════════ */}
      <Box
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="페이지 읽기 진행률"
        sx={{
          position: 'fixed',
          top: 0, left: 0,
          height: 3,
          bgcolor: '#C8102E',
          /* AppBar(1100)보다 위 — 헤더 숨겨도 항상 노출 */
          zIndex: 1400,
          pointerEvents: 'none',
          width: `${scrollProgress}%`,
          transition: 'width 0.08s linear',
          /* 진행 중일 때 빨간 glow */
          boxShadow: scrollProgress > 1 && scrollProgress < 99
            ? '0 0 8px rgba(200,16,46,0.55)'
            : 'none',
          /* 0%·100% 에서는 숨김 */
          opacity: scrollProgress > 0.5 && scrollProgress < 99.5 ? 1 : 0,
        }}
      />

      {/* ════════════════════════════════════
          AppBar — position: fixed
          · atTop=true  → 투명 (Hero 위)
          · atTop=false → blur 불투명
          · hidden=true → translateY(-100%)
      ════════════════════════════════════ */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: atTop
            ? 'transparent'
            : 'rgba(5, 5, 5, 0.88)',
          backdropFilter: atTop ? 'none' : 'blur(16px)',
          boxShadow: 'none',
          borderBottom: atTop
            ? 'none'
            : '1px solid rgba(255,255,255,0.05)',
          /* CSS transform으로 GPU 가속 숨김/표시 */
          transition: [
            'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            'background-color 0.3s ease',
            'backdrop-filter 0.3s ease',
          ].join(', '),
          transform: navbarHidden ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>

          {/* 로고 */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 900,
              letterSpacing: '0.05em',
              fontSize: '1.5rem',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.75 },
            }}
          >
            PORTFOLIO
          </Typography>

          {/* 데스크톱 메뉴 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? '#C8102E' : '#fff',
                    fontWeight: isActive ? 700 : 400,
                    fontSize: '0.95rem',
                    px: 2, py: 1.2,
                    position: 'relative',
                    transition: 'color 0.2s',
                    /* 활성 언더라인: scaleX 애니메이션 */
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6, left: '50%',
                      width: '60%', height: 2,
                      bgcolor: '#C8102E',
                      transformOrigin: 'center',
                      transform: isActive
                        ? 'translateX(-50%) scaleX(1)'
                        : 'translateX(-50%) scaleX(0)',
                      transition: 'transform 0.25s ease',
                    },
                    '&:hover': {
                      color: '#C8102E',
                      bgcolor: 'transparent',
                      '&::after': { transform: 'translateX(-50%) scaleX(1)' },
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* 모바일 햄버거 버튼 — 터치 타겟 44×44px */}
          <IconButton
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={drawerOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: '#fff',
              width: 44, height: 44,
              borderRadius: 1,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            <HamburgerIcon open={drawerOpen} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ════════════════════════════════════
          모바일 드로어 (우측 슬라이드)
      ════════════════════════════════════ */}
      <Drawer
        id="mobile-drawer"
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#050505',
            width: { xs: '82vw', sm: 300 },
            borderLeft: '1px solid #1A1A1A',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        ModalProps={{ keepMounted: true }} // DOM 유지로 애니메이션 안정성 확보
      >
        {/* 드로어 헤더 */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 2.5,
          borderBottom: '1px solid #1A1A1A',
          flexShrink: 0,
        }}>
          <Typography sx={{
            color: '#fff', fontWeight: 900,
            letterSpacing: '0.08em', fontSize: '0.85rem',
            textTransform: 'uppercase',
          }}>
            Navigation
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="메뉴 닫기"
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              '&:hover': { color: '#C8102E', bgcolor: 'rgba(200,16,46,0.08)' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 네비게이션 아이템 — stagger 등장 */}
        <List sx={{ pt: 2, px: 2, flexGrow: 1 }}>
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    py: 1.8, px: 2.5,
                    borderLeft: `3px solid ${isActive ? '#C8102E' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    /* stagger: 드로어 열릴 때 순서대로 슬라이드인 */
                    opacity: drawerOpen ? 1 : 0,
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(28px)',
                    transitionDelay: drawerOpen ? `${0.05 + idx * 0.07}s` : '0s',
                    '&:hover': {
                      bgcolor: 'rgba(200,16,46,0.06)',
                      borderLeftColor: '#C8102E',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    secondary={item.subLabel}
                    primaryTypographyProps={{
                      sx: {
                        color: isActive ? '#C8102E' : '#fff',
                        fontWeight: isActive ? 700 : 400,
                        fontSize: '1.05rem',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: isActive ? 'rgba(200,16,46,0.6)' : '#444',
                        fontSize: '0.7rem',
                        letterSpacing: 1,
                      },
                    }}
                  />
                  {/* 활성 인디케이터 dot */}
                  {isActive && (
                    <Box sx={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      bgcolor: '#C8102E',
                      flexShrink: 0,
                    }} aria-hidden="true" />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* 드로어 하단: 소셜 링크 */}
        <Box sx={{
          px: 3, py: 3,
          borderTop: '1px solid #1A1A1A',
          flexShrink: 0,
          opacity: drawerOpen ? 1 : 0,
          transform: drawerOpen ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.35s ease ${0.05 + NAV_ITEMS.length * 0.07}s, transform 0.35s ease ${0.05 + NAV_ITEMS.length * 0.07}s`,
        }}>
          <Typography sx={{
            color: '#333', fontSize: '0.57rem',
            letterSpacing: 3.5, mb: 2, textTransform: 'uppercase',
          }}>
            Connect
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub', href: 'https://github.com/gyeongsik753-design' },
              { label: 'Email',  href: 'mailto:gyeongsik753@gmail.com' },
            ].map(({ label, href }) => (
              <Button
                key={label}
                component="a"
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: '#666',
                  border: '1px solid #1E1E1E',
                  borderRadius: 0,
                  px: 2, py: 0.8,
                  fontSize: '0.72rem',
                  letterSpacing: 1.5,
                  minHeight: 36, // 터치 타겟
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#C8102E',
                    borderColor: '#C8102E',
                    bgcolor: 'rgba(200,16,46,0.05)',
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
