import { useRef, useEffect, useState, memo } from 'react';
import { Box, Typography, Container, Button, Divider, Avatar, Grid, Chip, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import { usePortfolio, CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';
import ContactSection from '../components/ContactSection';

/* ─── 공통 헬퍼 컴포넌트 (memo: 부모 리렌더 시 불필요한 재렌더 방지) ─── */
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

/* ─── 홈용 미니 스킬 카드 (memo + 스크롤 애니메이션) ─── */
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
        <Box
          sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-hidden="true"
        >
          {ICON_MAP[skill.icon] || ICON_MAP.CodeIcon}
        </Box>

        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111', textAlign: 'center', lineHeight: 1.3 }}>
          {skill.name}
        </Typography>

        {/* 애니메이션 프로그레스 바 */}
        <Box
          role="progressbar"
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} 숙련도`}
          sx={{ width: '100%', height: 4, bgcolor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}
        >
          <Box
            sx={{
              height: '100%',
              width: visible ? `${skill.level}%` : '0%',
              bgcolor: cat.color,
              borderRadius: 2,
              transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>

        <Chip
          label={`${skill.level}%`}
          size="small"
          aria-hidden="true"
          sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 18, fontSize: '0.65rem' }}
        />
      </Box>
    </Tooltip>
  );
});

/* ─── 메인 컴포넌트 ─── */
const Home = () => {
  /* homeData 는 useMemo 로 미리 계산된 값 — 함수 호출 불필요 */
  const { homeData } = usePortfolio();
  const { content: homeContent, skills: topSkills, basicInfo } = homeData;

  /* 스킬 섹션 IntersectionObserver */
  const skillsRef      = useRef(null);
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

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        component="section"
        id="hero"
        aria-label="히어로 섹션"
        sx={{ bgcolor: '#000', color: '#fff', py: { xs: 10, md: 16 }, px: 2, textAlign: 'center' }}
      >
        <Container maxWidth="md">
          <Box sx={{ py: { xs: 2, md: 4 } }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 900, letterSpacing: '-0.03em', mb: 3, lineHeight: 1.1 }}
            >
              HERO
            </Typography>
            <SectionDivider />
            <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
              여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── About Me (Context 연동) ── */}
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
                      /* 페이드인 애니메이션 */
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

      {/* ── Skill Tree (Context 연동 + IntersectionObserver 애니메이션) ── */}
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
              container
              spacing={2}
              justifyContent="center"
              sx={{ maxWidth: { xs: '100%', sm: 560 }, mx: 'auto', mb: 4 }}
              role="list"
              aria-label="주요 스킬 목록"
            >
              {topSkills.map((skill, idx) => (
                <Grid
                  item
                  xs={6}
                  sm={3}
                  key={skill.id}
                  role="listitem"
                  sx={{
                    animation: skillsVisible ? 'fadeSlideIn 0.4s ease both' : 'none',
                    animationDelay: skillsVisible ? `${idx * 0.1}s` : '0s',
                    '@keyframes fadeSlideIn': {
                      from: { opacity: 0, transform: 'translateY(12px)' },
                      to:   { opacity: 1, transform: 'translateY(0)'    },
                    },
                  }}
                >
                  <MiniSkillCard skill={skill} visible={skillsVisible} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mb: 4 }}
              role="status"
            >
              <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                About Me 탭에서 스킬을 추가하면 여기에 자동으로 표시됩니다.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              component={Link}
              to="/about"
              endIcon={<ArrowForwardIcon />}
              aria-label="전체 스킬 목록 보기"
              sx={{ borderColor: '#111', color: '#111', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#111', color: '#fff' } }}
            >
              전체 스킬 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Projects ── */}
      <Box
        component="section"
        id="projects"
        aria-label="프로젝트 섹션"
        sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}
      >
        <Container maxWidth="md">
          <SectionTitle dark>PROJECTS</SectionTitle>
          <SectionDivider />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
            여기는 Projects 섹션입니다.
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to="/projects"
            endIcon={<ArrowForwardIcon />}
            aria-label="프로젝트 목록 페이지로 이동"
            sx={{ color: '#fff', borderColor: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { borderColor: '#C8102E', color: '#C8102E', bgcolor: 'transparent' } }}
          >
            더 보기
          </Button>
        </Container>
      </Box>

      {/* ── Contact ── */}
      <Box
        component="section"
        id="contact"
        aria-label="연락처 섹션"
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
