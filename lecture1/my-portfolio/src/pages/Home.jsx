import { useRef, useEffect, useState, memo } from 'react';
import { Box, Typography, Container, Button, Divider, Avatar, Grid, Chip, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import { usePortfolio, CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';
import ContactSection from '../components/ContactSection';

/* ─── 공통 헬퍼 컴포넌트 ─── */
const SectionTitle = memo(({ children, dark = false }) => (
  <Typography
    variant="h3"
    sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: '-0.02em', color: dark ? '#fff' : '#000' }}
  >
    {children}
  </Typography>
));

const SectionDivider = memo(() => (
  <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
));

/* ─── 홈용 미니 스킬 카드 ─── */
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
        <Box
          role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}
          aria-label={`${skill.name} 숙련도`}
          sx={{ width: '100%', height: 4, bgcolor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}
        >
          <Box sx={{ height: '100%', width: visible ? `${skill.level}%` : '0%', bgcolor: cat.color, borderRadius: 2, transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </Box>
        <Chip label={`${skill.level}%`} size="small" aria-hidden="true" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 18, fontSize: '0.65rem' }} />
      </Box>
    </Tooltip>
  );
});

/* ─── 타이핑 커서 ─── */
const Cursor = () => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: 'inline-block', width: '2px', height: '1.2em',
      bgcolor: '#C8102E', ml: '2px', verticalAlign: 'middle',
      animation: 'cursorBlink 0.9s step-end infinite',
      '@keyframes cursorBlink': {
        '0%, 100%': { opacity: 1 },
        '50%':       { opacity: 0 },
      },
    }}
  />
);

/* ─── 메인 컴포넌트 ─── */
const TAGLINE = '조리사에서 개발자로, 표현의 방식을 바꾼 사람';

const Home = () => {
  const { homeData } = usePortfolio();
  const { content: homeContent, skills: topSkills, basicInfo } = homeData;

  /* 스킬 섹션 IntersectionObserver */
  const skillsRef = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* 타이핑 효과 — 이름 애니메이션(~0.65s) 완료 후 시작 */
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
      let idx = 0;
      const intervalId = setInterval(() => {
        idx += 1;
        setDisplayText(TAGLINE.slice(0, idx));
        if (idx >= TAGLINE.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 55);
      return () => clearInterval(intervalId);
    }, 1200);
    return () => clearTimeout(startTimer);
  }, []);

  return (
    <Box>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <Box
        component="section"
        id="hero"
        aria-label="소개 섹션"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          px: 2,
          textAlign: 'center',
          overflow: 'hidden',
          /* 베이스: 진한 검정 + 우하단 미묘한 그라데이션 */
          background: 'linear-gradient(145deg, #060606 0%, #080808 50%, #0e0003 100%)',
        }}
      >

        {/* ── 배경 레이어 1: 도트 그리드 ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(200,16,46,0.13) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        {/* ── 배경 레이어 2: 좌상단 빨간 Glow ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 55% 45% at 5% 5%, rgba(200,16,46,0.22) 0%, transparent 70%)',
          }}
        />

        {/* ── 기하학 도형 A: 대형 원 윤곽선 (우상단 / 느린 회전) ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: { xs: -120, md: -160 },
            right: { xs: -100, md: -60 },
            width: { xs: 320, md: 500 },
            height: { xs: 320, md: 500 },
            borderRadius: '50%',
            border: '1px solid rgba(200,16,46,0.14)',
            animation: 'spinCW 35s linear infinite',
            '@keyframes spinCW': {
              to: { transform: 'rotate(360deg)' },
            },
            /* 내부 원 */
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '14%',
              borderRadius: '50%',
              border: '1px solid rgba(200,16,46,0.07)',
            },
          }}
        />

        {/* ── 기하학 도형 B: 중형 원 윤곽선 (좌하단 / 역방향) ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            bottom: { xs: 60, md: 80 },
            left: { xs: -60, md: -20 },
            width: { xs: 200, md: 280 },
            height: { xs: 200, md: 280 },
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            animation: 'spinCCW 25s linear infinite',
            '@keyframes spinCCW': {
              to: { transform: 'rotate(-360deg)' },
            },
          }}
        />

        {/* ── 기하학 도형 C: 소형 사각형 윤곽선 (우하단 / 부유) ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            bottom: { xs: 80, md: 130 },
            right: { xs: 24, md: 100 },
            width: { xs: 48, md: 72 },
            height: { xs: 48, md: 72 },
            border: '1px solid rgba(200,16,46,0.22)',
            animation: 'floatUpDown 5s ease-in-out infinite',
            animationDelay: '1s',
            '@keyframes floatUpDown': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)'   },
              '50%':       { transform: 'translateY(-16px) rotate(8deg)' },
            },
          }}
        />

        {/* ── 기하학 도형 D: 소형 사각형 (중앙 좌측 / 다른 타이밍) ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '40%',
            left: { xs: 16, md: '6%' },
            width: { xs: 28, md: 40 },
            height: { xs: 28, md: 40 },
            border: '1px solid rgba(255,255,255,0.07)',
            animation: 'floatUpDown 7s ease-in-out infinite',
            animationDelay: '2.5s',
          }}
        />

        {/* ── 포인트 도트들 ── */}
        {[
          { top: '28%', left: { xs: '5%', md: '9%' }, delay: '0s',   size: 5 },
          { top: '18%', right: { xs: '8%', md: '14%' }, delay: '1s',  size: 4 },
          { bottom: '35%', right: { xs: '6%', md: '10%' }, delay: '2s', size: 3 },
          { bottom: '25%', left: { xs: '12%', md: '18%' }, delay: '1.5s', size: 4 },
        ].map((pos, i) => (
          <Box
            key={i}
            aria-hidden="true"
            sx={{
              position: 'absolute', ...pos,
              width: pos.size, height: pos.size,
              borderRadius: '50%', bgcolor: '#C8102E',
              animation: 'pulseDot 3s ease-in-out infinite',
              animationDelay: pos.delay,
              '@keyframes pulseDot': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)'   },
                '50%':       { opacity: 1,   transform: 'scale(1.8)' },
              },
            }}
          />
        ))}

        {/* ──────────── 메인 콘텐츠 ──────────── */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

          {/* ① 직무 배지 */}
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1.5,
              mb: { xs: 3, md: 4 },
              opacity: 0,
              animation: 'heroFadeUp 0.6s ease forwards',
              animationDelay: '0.1s',
              '@keyframes heroFadeUp': {
                from: { opacity: 0, transform: 'translateY(18px)' },
                to:   { opacity: 1, transform: 'translateY(0)'    },
              },
            }}
          >
            <Box sx={{ width: 24, height: 1, bgcolor: '#C8102E' }} />
            <Typography
              component="span"
              sx={{
                color: '#C8102E', fontWeight: 700,
                fontSize: { xs: '0.65rem', md: '0.72rem' },
                letterSpacing: { xs: 3, md: 5 },
                textTransform: 'uppercase',
              }}
            >
              UI/UX · Frontend Developer
            </Typography>
            <Box sx={{ width: 24, height: 1, bgcolor: '#C8102E' }} />
          </Box>

          {/* ② 이름 — 글자별 stagger 등장 */}
          <Typography
            variant="h1"
            component="h1"
            aria-label="신경식"
            sx={{
              fontSize: { xs: '5rem', sm: '7rem', md: '10rem' },
              fontWeight: 900,
              letterSpacing: { xs: '-0.03em', md: '-0.045em' },
              lineHeight: 0.95,
              mb: { xs: 2.5, md: 3 },
              /* 텍스트 그라데이션: 흰 → 연회색 */
              background: 'linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {'신경식'.split('').map((char, i) => (
              <Box
                component="span"
                key={i}
                sx={{
                  display: 'inline-block',
                  opacity: 0,
                  animation: 'heroFadeUp 0.5s ease forwards',
                  animationDelay: `${0.3 + i * 0.12}s`,
                }}
              >
                {char}
              </Box>
            ))}
          </Typography>

          {/* ③ 빨간 bar — 가운데서 양쪽으로 확장 */}
          <Box
            aria-hidden="true"
            sx={{
              height: 3, bgcolor: '#C8102E', mx: 'auto',
              mb: { xs: 3, md: 4 },
              transformOrigin: 'center',
              transform: 'scaleX(0)',
              width: 56,
              animation: 'barExpand 0.5s ease forwards',
              animationDelay: '0.72s',
              '@keyframes barExpand': {
                from: { transform: 'scaleX(0)' },
                to:   { transform: 'scaleX(1)' },
              },
            }}
          />

          {/* ④ 슬로건 — 타이핑 효과 */}
          <Box
            sx={{
              minHeight: { xs: '3.2rem', md: '4rem' },
              mb: { xs: 2, md: 2.5 },
              opacity: 0,
              animation: 'heroFadeUp 0.5s ease forwards',
              animationDelay: '0.82s',
            }}
          >
            <Typography
              component="p"
              sx={{
                fontWeight: 300,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.45rem' },
                color: '#D8D8D8',
                letterSpacing: '0.01em',
                lineHeight: 1.7,
              }}
            >
              {/* 앞부분: 일반 */}
              {displayText.includes('바꾼') ? (
                <>
                  {displayText.slice(0, displayText.indexOf('표현'))}
                  <Box
                    component="span"
                    sx={{
                      color: '#C8102E',
                      fontWeight: 600,
                      textShadow: '0 0 20px rgba(200,16,46,0.4)',
                    }}
                  >
                    {displayText.slice(displayText.indexOf('표현'))}
                  </Box>
                </>
              ) : (
                displayText
              )}
              {isTyping && <Cursor />}
              {/* 타이핑 완료 후 커서 유지 */}
              {!isTyping && displayText.length === TAGLINE.length && <Cursor />}
            </Typography>
          </Box>

          {/* ⑤ 보조 설명 */}
          <Typography
            variant="body1"
            sx={{
              color: '#5a5a5a',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              maxWidth: 380,
              mx: 'auto',
              mb: { xs: 5, md: 7 },
              lineHeight: 2,
              opacity: 0,
              animation: 'heroFadeUp 0.5s ease forwards',
              animationDelay: '0.92s',
            }}
          >
            보여주고 싶은 것을 직접 만듭니다.
            <br />
            Figma로 설계하고 React로 구현하는 개발자입니다.
          </Typography>

          {/* ⑥ CTA 버튼 */}
          <Box
            sx={{
              display: 'flex', gap: { xs: 1.5, md: 2 },
              justifyContent: 'center', flexWrap: 'wrap',
              opacity: 0,
              animation: 'heroFadeUp 0.5s ease forwards',
              animationDelay: '1.02s',
            }}
          >
            {/* Primary: 프로젝트 보기 */}
            <Button
              variant="contained"
              component={Link}
              to="/projects"
              endIcon={<ArrowForwardIcon />}
              aria-label="프로젝트 보기 페이지로 이동"
              sx={{
                position: 'relative', overflow: 'hidden',
                bgcolor: '#C8102E', color: '#fff',
                px: { xs: 3.5, md: 4.5 }, py: { xs: 1.4, md: 1.75 },
                borderRadius: 0, fontWeight: 700,
                fontSize: { xs: '0.875rem', md: '1rem' },
                boxShadow: '0 0 18px rgba(200,16,46,0.28)',
                transition: 'all 0.25s ease',
                /* 호버 스윕 효과 */
                '&::before': {
                  content: '""',
                  position: 'absolute', top: 0, left: '-100%',
                  width: '100%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  transition: 'left 0.4s ease',
                },
                '&:hover': {
                  bgcolor: '#A00D25',
                  boxShadow: '0 0 38px rgba(200,16,46,0.55)',
                  transform: 'translateY(-3px)',
                },
                '&:hover::before': { left: '100%' },
              }}
            >
              프로젝트 보기
            </Button>

            {/* Secondary: 더 알아보기 */}
            <Button
              variant="outlined"
              component={Link}
              to="/about"
              aria-label="About Me 페이지로 이동"
              sx={{
                color: '#bbb', borderColor: 'rgba(255,255,255,0.18)',
                px: { xs: 3.5, md: 4.5 }, py: { xs: 1.4, md: 1.75 },
                borderRadius: 0, fontWeight: 500,
                fontSize: { xs: '0.875rem', md: '1rem' },
                transition: 'all 0.25s ease',
                '&:hover': {
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              더 알아보기
            </Button>
          </Box>
        </Container>

        {/* ⑦ 스크롤 유도 화살표 */}
        <Box
          aria-hidden="true"
          component="a"
          href="#about-me"
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 32 },
            left: '50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
            color: 'rgba(255,255,255,0.22)',
            textDecoration: 'none', cursor: 'pointer',
            transition: 'color 0.2s',
            '&:hover': { color: '#C8102E' },
            opacity: 0,
            animation: 'heroFadeUp 0.5s ease forwards, heroBounce 2.2s ease-in-out infinite',
            animationDelay: '1.8s, 2.2s',
            '@keyframes heroBounce': {
              '0%, 100%': { transform: 'translateX(-50%) translateY(0)'   },
              '50%':       { transform: 'translateX(-50%) translateY(9px)' },
            },
            /* fadeUp 이후 bounce 가 translateX(-50%) 를 덮으므로 초기 배치는 left로만 */
            transform: 'translateX(-50%)',
          }}
        >
          <Typography sx={{ fontSize: '0.58rem', letterSpacing: 4, textTransform: 'uppercase', opacity: 0.6 }}>
            scroll
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>

      {/* ═══════════════════════════════════════════
          ABOUT ME (Context 연동)
      ═══════════════════════════════════════════ */}
      <Box
        component="section"
        id="about-me"
        aria-labelledby="home-about-title"
        sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 }, px: 2 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle><span id="home-about-title">ABOUT ME</span></SectionTitle>
            <SectionDivider />
          </Box>

          <Grid container spacing={4} alignItems="flex-start">
            {/* 프로필 카드 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ border: '1px solid #E0E0E0', p: 3, textAlign: 'center' }}>
                <Avatar
                  src={basicInfo.photo || undefined}
                  sx={{ width: 100, height: 100, bgcolor: '#E0E0E0', border: '3px solid #111', mx: 'auto', mb: 2 }}
                  alt={`${basicInfo.name} 프로필 사진`}
                >
                  {!basicInfo.photo && <PersonIcon sx={{ fontSize: '2.5rem', color: '#999' }} aria-hidden="true" />}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>{basicInfo.name}</Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>{basicInfo.experience}</Typography>
                <Divider sx={{ mb: 2 }} />
                {[
                  { label: '학력', value: basicInfo.education },
                  { label: '전공', value: basicInfo.major },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>{label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#333', textAlign: 'right', maxWidth: '60%' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* 스토리 영역 */}
            <Grid item xs={12} md={8}>
              {homeContent.length > 0 ? (
                homeContent.map((item, idx) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 3, pb: 3,
                      borderBottom: idx < homeContent.length - 1 ? '1px solid #F0F0F0' : 'none',
                      animation: 'fadeSlideIn 0.4s ease both',
                      animationDelay: `${idx * 0.08}s`,
                      '@keyframes fadeSlideIn': {
                        from: { opacity: 0, transform: 'translateY(8px)' },
                        to:   { opacity: 1, transform: 'translateY(0)'   },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 3, height: 16, bgcolor: '#C8102E', borderRadius: 2 }} aria-hidden="true" />
                      <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 2 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 2 }}>
                      {item.summary}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center' }} role="status">
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                    About Me 탭에서 내용을 작성하면 여기에 자동으로 표시됩니다.
                  </Typography>
                </Box>
              )}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/about"
                  endIcon={<ArrowForwardIcon />}
                  aria-label="About Me 페이지로 이동"
                  sx={{ bgcolor: '#000', color: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#333' } }}
                >
                  더 알아보기
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          SKILL TREE (Context 연동 + Intersection 애니메이션)
      ═══════════════════════════════════════════ */}
      <Box
        ref={skillsRef}
        component="section"
        id="skill-tree"
        aria-labelledby="home-skill-title"
        sx={{ bgcolor: '#F5F5F5', py: { xs: 8, md: 12 }, px: 2 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle><span id="home-skill-title">SKILL TREE</span></SectionTitle>
            <SectionDivider />
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
              현재 보유 기술 중 숙련도 상위 스킬입니다.
            </Typography>
          </Box>

          {topSkills.length > 0 ? (
            <Grid
              container spacing={2} justifyContent="center"
              sx={{ maxWidth: { xs: '100%', sm: 560 }, mx: 'auto', mb: 4 }}
              role="list" aria-label="주요 스킬 목록"
            >
              {topSkills.map((skill, idx) => (
                <Grid
                  item xs={6} sm={3} key={skill.id} role="listitem"
                  sx={{
                    animation: skillsVisible ? 'fadeSlideIn 0.4s ease both' : 'none',
                    animationDelay: skillsVisible ? `${idx * 0.1}s` : '0s',
                  }}
                >
                  <MiniSkillCard skill={skill} visible={skillsVisible} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mb: 4 }} role="status">
              <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                About Me 탭에서 스킬을 추가하면 여기에 자동으로 표시됩니다.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined" component={Link} to="/about" endIcon={<ArrowForwardIcon />}
              aria-label="전체 스킬 목록 보기"
              sx={{ borderColor: '#111', color: '#111', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#111', color: '#fff' } }}
            >
              전체 스킬 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════════ */}
      <Box
        component="section" id="projects" aria-label="프로젝트 섹션"
        sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}
      >
        <Container maxWidth="md">
          <SectionTitle dark>PROJECTS</SectionTitle>
          <SectionDivider />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
            여기는 Projects 섹션입니다.
          </Typography>
          <Button
            variant="outlined" component={Link} to="/projects" endIcon={<ArrowForwardIcon />}
            aria-label="프로젝트 목록 페이지로 이동"
            sx={{ color: '#fff', borderColor: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { borderColor: '#C8102E', color: '#C8102E', bgcolor: 'transparent' } }}
          >
            더 보기
          </Button>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════ */}
      <Box
        component="section" id="contact" aria-label="연락처 섹션"
        sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2 }}
      >
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
