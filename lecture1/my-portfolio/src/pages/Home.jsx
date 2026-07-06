import { Box, Typography, Container, Button, Divider, Avatar, Grid, Chip, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import { usePortfolio, CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';
import ContactSection from '../components/ContactSection';

/* ─── 공통 섹션 래퍼 ─── */
const Section = ({ children, dark = false, subtle = false, id }) => (
  <Box id={id} sx={{ bgcolor: dark ? '#000' : subtle ? '#F5F5F5' : '#fff', color: dark ? '#fff' : '#000', py: { xs: 8, md: 12 }, px: 2 }}>
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      {children}
    </Container>
  </Box>
);

const SectionTitle = ({ children, dark = false }) => (
  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: '-0.02em', color: dark ? '#fff' : '#000' }}>
    {children}
  </Typography>
);

const SectionDivider = () => (
  <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
);

/* ─── 홈용 미니 스킬 카드 ─── */
const MiniSkillCard = ({ skill }) => {
  const cat = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Design;
  return (
    <Tooltip title={`${skill.name} · ${skill.level}%`} placement="top" arrow>
      <Box
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          p: 2, border: '1px solid #E0E0E0', borderRadius: 0,
          transition: 'all 0.2s', cursor: 'default',
          '&:hover': { borderColor: cat.color, bgcolor: cat.bg },
        }}
      >
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ICON_MAP[skill.icon] || ICON_MAP.CodeIcon}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111', textAlign: 'center', lineHeight: 1.3 }}>
          {skill.name}
        </Typography>
        {/* 미니 프로그레스 */}
        <Box sx={{ width: '100%', height: 4, bgcolor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${skill.level}%`, bgcolor: cat.color, borderRadius: 2 }} />
        </Box>
        <Chip label={`${skill.level}%`} size="small" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 18, fontSize: '0.65rem' }} />
      </Box>
    </Tooltip>
  );
};

/* ─── 메인 컴포넌트 ─── */
const Home = () => {
  const { getHomeData } = usePortfolio();
  const { content: homeContent, skills: topSkills, basicInfo } = getHomeData();

  return (
    <Box>
      {/* Hero */}
      <Section dark id="hero">
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 900, letterSpacing: '-0.03em', mb: 3, lineHeight: 1.1 }}>
            HERO
          </Typography>
          <SectionDivider />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
          </Typography>
        </Box>
      </Section>

      {/* ── About Me (Context 연동) ── */}
      <Box id="about-me" sx={{ bgcolor: '#fff', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle>ABOUT ME</SectionTitle>
            <SectionDivider />
          </Box>

          <Grid container spacing={4} alignItems="flex-start">
            {/* 프로필 사이드 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ border: '1px solid #E0E0E0', p: 3, textAlign: 'center' }}>
                <Avatar
                  src={basicInfo.photo || undefined}
                  sx={{ width: 100, height: 100, bgcolor: '#E0E0E0', border: '3px solid #111', mx: 'auto', mb: 2 }}
                >
                  {!basicInfo.photo && <PersonIcon sx={{ fontSize: '2.5rem', color: '#999' }} />}
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

            {/* 스토리 메인 */}
            <Grid item xs={12} md={8}>
              {homeContent.length > 0 ? (
                homeContent.map((item) => (
                  <Box key={item.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #F0F0F0', '&:last-child': { border: 'none', mb: 0, pb: 0 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 3, height: 16, bgcolor: '#C8102E', borderRadius: 2 }} />
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
                <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                    About Me 탭에서 내용을 작성하면 여기에 표시됩니다.
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained" component={Link} to="/about" endIcon={<ArrowForwardIcon />}
                  sx={{ bgcolor: '#000', color: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#333' } }}
                >
                  더 알아보기
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Skill Tree (Context 연동) ── */}
      <Box id="skill-tree" sx={{ bgcolor: '#F5F5F5', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle>SKILL TREE</SectionTitle>
            <SectionDivider />
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
              현재 보유 기술 중 숙련도 상위 스킬입니다.
            </Typography>
          </Box>

          {topSkills.length > 0 ? (
            <>
              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                {topSkills.map((skill) => (
                  <Grid item xs={6} sm={3} key={skill.id}>
                    <MiniSkillCard skill={skill} />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box sx={{ border: '1px dashed #E0E0E0', p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mb: 4 }}>
              <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                About Me 탭에서 스킬을 추가하면 여기에 표시됩니다.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined" component={Link} to="/about" endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: '#111', color: '#111', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { bgcolor: '#111', color: '#fff' } }}
            >
              전체 스킬 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Projects */}
      <Section dark id="projects">
        <SectionTitle dark>PROJECTS</SectionTitle>
        <SectionDivider />
        <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 600, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
          여기는 Projects 섹션입니다.
        </Typography>
        <Button variant="outlined" component={Link} to="/projects" endIcon={<ArrowForwardIcon />}
          sx={{ color: '#fff', borderColor: '#fff', px: 4, py: 1.5, borderRadius: 0, fontWeight: 600, '&:hover': { borderColor: '#C8102E', color: '#C8102E', bgcolor: 'transparent' } }}>
          더 보기
        </Button>
      </Section>

      {/* Contact */}
      <Box id="contact" sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2 }}>
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
