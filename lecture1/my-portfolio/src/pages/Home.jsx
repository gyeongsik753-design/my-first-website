import { useRef, useEffect, useState, memo, useCallback } from 'react';
import {
  Box, Typography, Container, Button, IconButton,
  Divider, Avatar, Grid, Chip, Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { usePortfolio, CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';
import ContactSection from '../components/ContactSection';

/* ─── smooth scroll ─── */
const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/* ─── 섹션 타이틀 ─── */
const SectionTitle = memo(({ children, dark = false }) => (
  <Typography
    variant="h3"
    sx={{
      fontWeight: 900, mb: 1,
      fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.5rem' },
      letterSpacing: '-0.02em',
      color: dark ? '#fff' : '#000',
    }}
  >
    {children}
  </Typography>
));

const SectionDivider = memo(() => (
  <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
));

/* ─── 홈 미니 스킬 카드 ─── */
const MiniSkillCard = memo(({ skill, visible }) => {
  const cat = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Design;
  return (
    <Tooltip title={`${skill.name} · 숙련도 ${skill.level}%`} placement="top" arrow>
      <Box
        role="article"
        aria-label={`${skill.name}, 숙련도 ${skill.level}퍼센트`}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          p: 2, border: '1px solid #E0E0E0', borderRadius: 0,
          transition: 'border-color 0.2s, background-color 0.2s',
          cursor: 'default',
          '&:hover': { borderColor: cat.color, bgcolor: cat.bg },
        }}
      >
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
          {ICON_MAP[skill.icon] || ICON_MAP.CodeIcon}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111', textAlign: 'center', lineHeight: 1.3 }}>
          {skill.name}
        </Typography>
        <Box role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} 숙련도`} sx={{ width: '100%', height: 4, bgcolor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: visible ? `${skill.level}%` : '0%', bgcolor: cat.color, borderRadius: 2, transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </Box>
        <Chip label={`${skill.level}%`} size="small" aria-hidden="true" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 18, fontSize: '0.65rem' }} />
      </Box>
    </Tooltip>
  );
});

/* ─── 타이핑 커서 ─── */
const Cursor = memo(() => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: 'inline-block', width: '2px', height: '1.1em',
      bgcolor: '#C8102E', ml: '3px', verticalAlign: 'middle',
      animation: 'cursorBlink 0.9s step-end infinite',
      '@keyframes cursorBlink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
    }}
  />
));

/* ─── 소셜 아이콘 버튼 ─── */
const SocialBtn = memo(({ icon, label, href, hoverColor = '#fff', hoverBg = 'rgba(255,255,255,0.08)', hoverShadow }) => (
  <Tooltip title={label} placement="top" arrow>
    <IconButton
      component="a"
      href={href}
      target={href.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      aria-label={label}
      sx={{
        /* 모바일: 52px, 태블릿+: 46px — 터치 타겟 최소 44px 준수 */
        width: { xs: 52, sm: 46 },
        height: { xs: 52, sm: 46 },
        border: '1px solid rgba(255,255,255,0.14)',
        color: 'rgba(255,255,255,0.4)',
        borderRadius: 0,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          color: hoverColor,
          borderColor: hoverColor,
          bgcolor: hoverBg,
          transform: 'translateY(-5px)',
          boxShadow: hoverShadow || '0 8px 24px rgba(255,255,255,0.08)',
        },
        '&:active': { transform: 'translateY(-2px)' },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
));

/* ════════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════════ */
const TAGLINE = '조리사에서 개발자로, 표현의 방식을 바꾼 사람';
const HIGHLIGHT_START = TAGLINE.indexOf('표현');

const Home = () => {
  /* ── useMediaQuery: 브레이크포인트 감지 ── */
  const theme = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));        // < 600px
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–899px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));           // ≥ 900px

  const { homeData } = usePortfolio();
  const { content: homeContent, skills: topSkills, basicInfo } = homeData;

  /* 스킬 IntersectionObserver */
  const skillsRef = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* 타이핑 효과 */
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setIsTyping(true);
      let idx = 0;
      const iv = setInterval(() => {
        idx += 1;
        setDisplayText(TAGLINE.slice(0, idx));
        if (idx >= TAGLINE.length) { clearInterval(iv); setIsTyping(false); }
      }, 55);
      return () => clearInterval(iv);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  /* 스크롤 핸들러 */
  const handleScrollContact = useCallback(() => scrollTo('contact'), []);
  const handleScrollAbout   = useCallback(() => scrollTo('about-me'), []);

  return (
    <Box>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <Box
        component="section"
        id="hero"
        aria-label="소개 섹션"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          /*
            App.jsx main의 pt(56/64px)를 상쇄하는 negative margin.
            Hero만 배경이 네비 뒤까지 full-bleed 로 확장되도록 처리.
            pt는 그대로 유지해 콘텐츠가 네비 아래에서 시작.
          */
          mt: { xs: '-56px', sm: '-64px' },
          pt: { xs: 10, sm: 8, md: 0 },
          pb: { xs: 10, sm: 8, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          /* 좌우 패딩: xs=16px, sm=24px — md 이상은 Container가 담당 */
          px: { xs: 2, sm: 3, md: 2 },
          textAlign: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #060606 0%, #080808 50%, #0e0003 100%)',
        }}
      >
        {/* 배경: 도트 그리드 — 모바일은 격자 촘촘하게 */}
        <Box aria-hidden="true" sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(200,16,46,0.13) 1px, transparent 1px)',
          backgroundSize: { xs: '26px 26px', sm: '32px 32px', md: '38px 38px' },
        }} />
        {/* 배경: 빨간 Glow */}
        <Box aria-hidden="true" sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 45% at 5% 5%, rgba(200,16,46,0.22) 0%, transparent 70%)',
        }} />

        {/* 장식 A: 대형 원 (우상단) */}
        <Box aria-hidden="true" sx={{
          position: 'absolute',
          top:   { xs: -80,  sm: -120, md: -160 },
          right: { xs: -80,  sm: -80,  md: -60  },
          width:  { xs: 200, sm: 340,  md: 500   },
          height: { xs: 200, sm: 340,  md: 500   },
          borderRadius: '50%',
          border: '1px solid rgba(200,16,46,0.14)',
          animation: 'spinCW 35s linear infinite',
          '@keyframes spinCW': { to: { transform: 'rotate(360deg)' } },
          '&::after': { content: '""', position: 'absolute', inset: '14%', borderRadius: '50%', border: '1px solid rgba(200,16,46,0.07)' },
        }} />

        {/* 장식 B: 중형 원 (좌하단) */}
        <Box aria-hidden="true" sx={{
          position: 'absolute',
          bottom: { xs: 50, sm: 60, md: 80 },
          left:   { xs: -50, sm: -40, md: -20 },
          width:  { xs: 120, sm: 200, md: 280  },
          height: { xs: 120, sm: 200, md: 280  },
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          animation: 'spinCCW 25s linear infinite',
          '@keyframes spinCCW': { to: { transform: 'rotate(-360deg)' } },
        }} />

        {/* 장식 C: 소형 사각형 (우하단) */}
        <Box aria-hidden="true" sx={{
          position: 'absolute',
          bottom: { xs: 70,  sm: 100, md: 130 },
          right:  { xs: 14,  sm: 40,  md: 100 },
          width:  { xs: 28,  sm: 48,  md: 72  },
          height: { xs: 28,  sm: 48,  md: 72  },
          border: '1px solid rgba(200,16,46,0.22)',
          animation: 'floatUpDown 5s ease-in-out infinite',
          animationDelay: '1s',
          '@keyframes floatUpDown': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%':       { transform: 'translateY(-14px) rotate(8deg)' },
          },
        }} />

        {/* 장식 D: 소형 사각형 (좌중단) — 모바일 제외, 태블릿+ 표시 */}
        {!isMobile && (
          <Box aria-hidden="true" sx={{
            position: 'absolute',
            top:    '40%',
            left:   { sm: 16, md: '6%' },
            width:  { sm: 28, md: 40 },
            height: { sm: 28, md: 40 },
            border: '1px solid rgba(255,255,255,0.07)',
            animation: 'floatUpDown 7s ease-in-out infinite',
            animationDelay: '2.5s',
          }} />
        )}

        {/* 포인트 도트 — 모바일: 상단 2개만, 태블릿+: 4개 */}
        {[
          { top: '28%', left: { xs: '4%', md: '9%' },      delay: '0s',   size: 5 },
          { top: '18%', right: { xs: '6%', md: '14%' },    delay: '1s',   size: 4 },
          { bottom: '35%', right: { xs: '5%', md: '10%' }, delay: '2s',   size: 3, mobileHide: true },
          { bottom: '25%', left: { xs: '10%', md: '18%' }, delay: '1.5s', size: 4, mobileHide: true },
        ]
          .filter(({ mobileHide }) => !mobileHide || !isMobile)
          .map(({ mobileHide: _m, ...pos }, i) => (
            <Box key={i} aria-hidden="true" sx={{
              position: 'absolute', ...pos,
              width: pos.size, height: pos.size,
              borderRadius: '50%', bgcolor: '#C8102E',
              animation: 'pulseDot 3s ease-in-out infinite',
              animationDelay: pos.delay,
              '@keyframes pulseDot': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%':       { opacity: 1,   transform: 'scale(1.8)' },
              },
            }} />
          ))}

        {/* ──────────── 메인 콘텐츠 ──────────── */}
        <Container
          maxWidth="md"
          sx={{
            position: 'relative', zIndex: 1,
            /* Container 내부 패딩 제거 — 부모 Box px로 통일 */
            px: { xs: 0, sm: 0 },
          }}
        >
          {/* ① 직무 배지 */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            mb: { xs: 2.5, sm: 3, md: 4 },
            opacity: 0,
            animation: 'heroFadeUp 0.6s ease forwards',
            animationDelay: '0.1s',
            '@keyframes heroFadeUp': {
              from: { opacity: 0, transform: 'translateY(18px)' },
              to:   { opacity: 1, transform: 'translateY(0)' },
            },
          }}>
            <Box sx={{ width: { xs: 14, sm: 20, md: 24 }, height: 1, bgcolor: '#C8102E' }} />
            <Typography component="span" sx={{
              color: '#C8102E', fontWeight: 700,
              fontSize: { xs: '0.57rem', sm: '0.62rem', md: '0.72rem' },
              letterSpacing: { xs: 2, sm: 3, md: 5 },
              textTransform: 'uppercase',
            }}>
              {/* 모바일에서 한 줄로 들어가도록 축약 없이 그대로 */}
              UI/UX · Frontend Developer
            </Typography>
            <Box sx={{ width: { xs: 14, sm: 20, md: 24 }, height: 1, bgcolor: '#C8102E' }} />
          </Box>

          {/* ② 이름 — 글자별 stagger */}
          <Typography
            variant="h1" component="h1" aria-label="신경식"
            sx={{
              /* xs: 320px 기준 3글자 × ~60px = 180px → 여유 있음 */
              fontSize: { xs: '3.8rem', sm: '5.5rem', md: '8rem', lg: '10rem' },
              fontWeight: 900,
              letterSpacing: { xs: '-0.02em', sm: '-0.03em', md: '-0.045em' },
              lineHeight: 0.95,
              mb: { xs: 2, sm: 2.5, md: 3 },
              background: 'linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {'신경식'.split('').map((char, i) => (
              <Box component="span" key={i} sx={{
                display: 'inline-block', opacity: 0,
                animation: 'heroFadeUp 0.5s ease forwards',
                animationDelay: `${0.3 + i * 0.12}s`,
              }}>
                {char}
              </Box>
            ))}
          </Typography>

          {/* ③ 빨간 accent bar */}
          <Box aria-hidden="true" sx={{
            height: { xs: 2, md: 3 },
            bgcolor: '#C8102E',
            mx: 'auto',
            mb: { xs: 2.5, sm: 3, md: 4 },
            width: { xs: 36, sm: 48, md: 56 },
            transformOrigin: 'center',
            transform: 'scaleX(0)',
            animation: 'barExpand 0.5s ease forwards',
            animationDelay: '0.72s',
            '@keyframes barExpand': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
          }} />

          {/* ④ 슬로건 — 타이핑 */}
          <Box sx={{
            /* 완성 텍스트 높이 미리 확보 → 레이아웃 점프 방지 */
            minHeight: { xs: '2.8rem', sm: '3.2rem', md: '4rem' },
            mb: { xs: 1.5, sm: 2, md: 2.5 },
            opacity: 0,
            animation: 'heroFadeUp 0.5s ease forwards',
            animationDelay: '0.82s',
          }}>
            <Typography component="p" sx={{
              fontWeight: 300,
              fontSize: { xs: '0.875rem', sm: '1.05rem', md: '1.3rem', lg: '1.45rem' },
              color: '#D8D8D8',
              letterSpacing: '0.01em',
              lineHeight: { xs: 1.65, sm: 1.7 },
              wordBreak: 'keep-all', /* 한국어 단어 중간 줄바꿈 방지 */
            }}>
              {HIGHLIGHT_START > 0 && displayText.length > HIGHLIGHT_START ? (
                <>
                  {displayText.slice(0, HIGHLIGHT_START)}
                  <Box component="span" sx={{ color: '#C8102E', fontWeight: 600, textShadow: '0 0 20px rgba(200,16,46,0.4)' }}>
                    {displayText.slice(HIGHLIGHT_START)}
                  </Box>
                </>
              ) : displayText}
              {(isTyping || displayText.length === TAGLINE.length) && <Cursor />}
            </Typography>
          </Box>

          {/* ⑤ 보조 설명 */}
          <Typography sx={{
            color: '#5a5a5a',
            fontSize: { xs: '0.78rem', sm: '0.85rem', md: '0.95rem' },
            maxWidth: { xs: '100%', sm: 360, md: 400 },
            mx: 'auto',
            mb: { xs: 4, sm: 5, md: 6 },
            lineHeight: { xs: 1.85, md: 2 },
            opacity: 0,
            animation: 'heroFadeUp 0.5s ease forwards',
            animationDelay: '0.92s',
            wordBreak: 'keep-all',
          }}>
            보여주고 싶은 것을 직접 만듭니다.
            <br />
            Figma로 설계하고 React로 구현하는 개발자입니다.
          </Typography>

          {/* ⑥ CTA 전체 영역 */}
          <Box sx={{ opacity: 0, animation: 'heroFadeUp 0.5s ease forwards', animationDelay: '1.02s' }}>

            {/* ── 메인 버튼 행 ── */}
            <Box sx={{
              display: 'flex',
              /* 모바일: 세로 쌓기 / 태블릿+: 가로 배치 */
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 3, sm: 3.5, md: 4.5 },
              /* 모바일: 버튼 최대 너비로 너무 넓어지지 않게 */
              maxWidth: { xs: 320, sm: 'none' },
              mx: 'auto',
            }}>

              {/* Primary: 프로젝트 보기 */}
              <Button
                variant="contained"
                component={Link}
                to="/projects"
                endIcon={<ArrowForwardIcon />}
                aria-label="프로젝트 목록 페이지로 이동"
                /* useMediaQuery로 fullWidth 결정 */
                fullWidth={isMobile}
                sx={{
                  position: 'relative', overflow: 'hidden',
                  bgcolor: '#C8102E', color: '#fff',
                  px: { xs: 3, sm: 3.5, md: 5 },
                  py: { xs: 1.6, sm: 1.5, md: 1.8 },
                  /* 터치 타겟 최소 48px (모바일 권고) */
                  minHeight: { xs: 48, sm: 44 },
                  borderRadius: 0, fontWeight: 700,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  letterSpacing: '0.04em',
                  boxShadow: '0 0 20px rgba(200,16,46,0.3), 0 4px 16px rgba(0,0,0,0.4)',
                  transition: 'all 0.25s ease',
                  '&::before': {
                    content: '""', position: 'absolute', top: 0, left: '-100%',
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                    transition: 'left 0.45s ease',
                  },
                  '&:hover': {
                    bgcolor: '#A00D25',
                    boxShadow: '0 0 44px rgba(200,16,46,0.6), 0 8px 24px rgba(0,0,0,0.5)',
                    transform: 'translateY(-3px)',
                  },
                  '&:hover::before': { left: '100%' },
                  '&:active': { transform: 'translateY(-1px)' },
                }}
              >
                프로젝트 보기
              </Button>

              {/* Secondary: 연락하기 */}
              <Button
                variant="outlined"
                onClick={handleScrollContact}
                startIcon={<EmailIcon sx={{ fontSize: '0.95rem !important' }} />}
                aria-label="연락처 섹션으로 이동"
                fullWidth={isMobile}
                sx={{
                  color: '#ccc', borderColor: 'rgba(255,255,255,0.2)',
                  px: { xs: 3, sm: 3.5, md: 5 },
                  py: { xs: 1.6, sm: 1.5, md: 1.8 },
                  minHeight: { xs: 48, sm: 44 },
                  borderRadius: 0, fontWeight: 500,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  letterSpacing: '0.04em',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.55)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
                  },
                  '&:active': { transform: 'translateY(-1px)' },
                }}
              >
                연락하기
              </Button>
            </Box>

            {/* ── 구분선 ── */}
            <Box sx={{
              display: 'flex', alignItems: 'center',
              gap: { xs: 1.5, md: 2 },
              justifyContent: 'center',
              mb: { xs: 2, sm: 2.5, md: 3 },
            }}>
              <Box sx={{ width: { xs: 32, md: 48 }, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Typography sx={{
                color: 'rgba(255,255,255,0.18)',
                fontSize: { xs: '0.52rem', md: '0.58rem' },
                letterSpacing: { xs: 3, md: 4 },
                textTransform: 'uppercase',
              }}>
                find me on
              </Typography>
              <Box sx={{ width: { xs: 32, md: 48 }, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>

            {/* ── 소셜 아이콘 — 모바일: gap 더 넓게 (터치 간격 확보) ── */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 2, sm: 1.5 },
              justifyContent: 'center',
            }}>
              <SocialBtn
                icon={<GitHubIcon fontSize="small" />}
                label="GitHub 프로필"
                href="https://github.com/gyeongsik753-design"
                hoverColor="#fff"
                hoverBg="rgba(255,255,255,0.08)"
                hoverShadow="0 8px 24px rgba(255,255,255,0.1)"
              />
              <SocialBtn
                icon={<LinkedInIcon fontSize="small" />}
                label="LinkedIn 프로필"
                href="https://linkedin.com"
                hoverColor="#0A66C2"
                hoverBg="rgba(10,102,194,0.12)"
                hoverShadow="0 8px 24px rgba(10,102,194,0.25)"
              />
              <SocialBtn
                icon={<EmailIcon fontSize="small" />}
                label="이메일 보내기"
                href="mailto:gyeongsik753@gmail.com"
                hoverColor="#C8102E"
                hoverBg="rgba(200,16,46,0.1)"
                hoverShadow="0 8px 24px rgba(200,16,46,0.25)"
              />
            </Box>
          </Box>
        </Container>

        {/* ⑦ 스크롤 화살표 */}
        <Box
          component="button"
          onClick={handleScrollAbout}
          aria-label="다음 섹션으로 스크롤"
          sx={{
            position: 'absolute',
            bottom: { xs: 14, sm: 22, md: 32 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: { xs: 0.3, md: 0.5 },
            /* 터치 타겟 패딩 추가 */
            p: { xs: 1.5, md: 1 },
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.22)',
            transition: 'color 0.2s',
            '&:hover': { color: '#C8102E' },
            '&:focus-visible': { outline: '2px solid #C8102E', outlineOffset: 4 },
            opacity: 0,
            animation: 'heroFadeUp 0.5s ease forwards, heroBounce 2.2s ease-in-out infinite',
            animationDelay: '1.8s, 2.4s',
            '@keyframes heroBounce': {
              '0%, 100%': { transform: 'translateX(-50%) translateY(0)'   },
              '50%':       { transform: 'translateX(-50%) translateY(9px)' },
            },
          }}
        >
          <Typography sx={{
            fontSize: { xs: '0.5rem', md: '0.58rem' },
            letterSpacing: { xs: 3, md: 4 },
            textTransform: 'uppercase',
            opacity: 0.6, color: 'inherit',
          }}>
            scroll
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: { xs: 15, md: 18 } }} />
        </Box>
      </Box>

      {/* ════════════════════════════════════════════
          ABOUT ME
      ════════════════════════════════════════════ */}
      <Box component="section" id="about-me" aria-labelledby="home-about-title" sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <SectionTitle><span id="home-about-title">ABOUT ME</span></SectionTitle>
            <SectionDivider />
          </Box>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Box sx={{ border: '1px solid #E0E0E0', p: 3, textAlign: 'center' }}>
                <Avatar src={basicInfo.photo || undefined} sx={{ width: 100, height: 100, bgcolor: '#E0E0E0', border: '3px solid #111', mx: 'auto', mb: 2 }} alt={`${basicInfo.name} 프로필 사진`}>
                  {!basicInfo.photo && <PersonIcon sx={{ fontSize: '2.5rem', color: '#999' }} aria-hidden="true" />}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>{basicInfo.name}</Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>{basicInfo.experience}</Typography>
                <Divider sx={{ mb: 2 }} />
                {[{ label: '학력', value: basicInfo.education }, { label: '전공', value: basicInfo.major }].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>{label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#333', textAlign: 'right', maxWidth: '60%' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {homeContent.length > 0 ? (
                homeContent.map((item, idx) => (
                  <Box key={item.id} sx={{ mb: 3, pb: 3, borderBottom: idx < homeContent.length - 1 ? '1px solid #F0F0F0' : 'none', animation: 'fadeSlideIn 0.4s ease both', animationDelay: `${idx * 0.08}s`, '@keyframes fadeSlideIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 3, height: 16, bgcolor: '#C8102E', borderRadius: 2 }} aria-hidden="true" />
                      <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 2 }}>{item.title}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 2 }}>{item.summary}</Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center' }} role="status">
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>About Me 탭에서 내용을 작성하면 여기에 자동으로 표시됩니다.</Typography>
                </Box>
              )}
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" component={Link} to="/about" endIcon={<ArrowForwardIcon />} aria-label="About Me 페이지로 이동" sx={{ bgcolor: '#000', color: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#333' } }}>
                  더 알아보기
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════
          SKILL TREE
      ════════════════════════════════════════════ */}
      <Box ref={skillsRef} component="section" id="skill-tree" aria-labelledby="home-skill-title" sx={{ bgcolor: '#F5F5F5', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <SectionTitle><span id="home-skill-title">SKILL TREE</span></SectionTitle>
            <SectionDivider />
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
              현재 보유 기술 중 숙련도 상위 스킬입니다.
            </Typography>
          </Box>
          {topSkills.length > 0 ? (
            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: { xs: '100%', sm: 560 }, mx: 'auto', mb: 4 }} role="list" aria-label="주요 스킬 목록">
              {topSkills.map((skill, idx) => (
                <Grid item xs={6} sm={3} key={skill.id} role="listitem" sx={{ animation: skillsVisible ? 'fadeSlideIn 0.4s ease both' : 'none', animationDelay: skillsVisible ? `${idx * 0.1}s` : '0s' }}>
                  <MiniSkillCard skill={skill} visible={skillsVisible} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mb: 4 }} role="status">
              <Typography variant="body2" sx={{ color: '#BDBDBD' }}>About Me 탭에서 스킬을 추가하면 여기에 자동으로 표시됩니다.</Typography>
            </Box>
          )}
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="outlined" component={Link} to="/about" endIcon={<ArrowForwardIcon />} aria-label="전체 스킬 목록 보기" sx={{ borderColor: '#111', color: '#111', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#111', color: '#fff' } }}>
              전체 스킬 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════
          PROJECTS
      ════════════════════════════════════════════ */}
      <Box component="section" id="projects" aria-label="프로젝트 섹션" sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <SectionTitle dark>PROJECTS</SectionTitle>
          <SectionDivider />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
            여기는 Projects 섹션입니다.
          </Typography>
          <Button variant="outlined" component={Link} to="/projects" endIcon={<ArrowForwardIcon />} aria-label="프로젝트 목록 페이지로 이동" sx={{ color: '#fff', borderColor: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { borderColor: '#C8102E', color: '#C8102E', bgcolor: 'transparent' } }}>
            더 보기
          </Button>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════ */}
      <Box component="section" id="contact" aria-label="연락처 섹션" sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <SectionTitle dark>CONTACT</SectionTitle>
          <SectionDivider />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 6 }}>
            함께 작업하고 싶으시다면 연락해 주세요. 방명록도 남겨주시면 감사하겠습니다.
          </Typography>
        </Container>
        <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
          <ContactSection />
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#000', color: '#666', py: 3, textAlign: 'center', borderTop: '1px solid #333' }}>
        <Typography variant="body2">&copy; 2026 Portfolio. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
