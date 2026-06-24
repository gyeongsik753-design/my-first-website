import { Box, Typography, Container, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContactSection from '../components/ContactSection';

const Section = ({ children, dark = false, subtle = false, id }) => (
  <Box
    id={id}
    sx={{
      bgcolor: dark ? '#000000' : subtle ? '#F5F5F5' : '#FFFFFF',
      color: dark ? '#FFFFFF' : '#000000',
      py: { xs: 8, md: 12 },
      px: 2,
    }}
  >
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      {children}
    </Container>
  </Box>
);

const SectionTitle = ({ children, dark = false }) => (
  <Typography
    variant="h3"
    sx={{
      fontWeight: 900,
      mb: 1,
      fontSize: { xs: '1.8rem', md: '2.5rem' },
      letterSpacing: '-0.02em',
      color: dark ? '#FFFFFF' : '#000000',
    }}
  >
    {children}
  </Typography>
);

const SectionDivider = ({ dark = false }) => (
  <Divider
    sx={{
      width: 60,
      mx: 'auto',
      my: 3,
      borderColor: '#C8102E',
      borderWidth: 2,
    }}
  />
);

const Home = () => {
  return (
    <Box>
      {/* Hero 섹션 */}
      <Section dark id="hero">
        <Box sx={{ py: { xs: 4, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              mb: 3,
              lineHeight: 1.1,
            }}
          >
            HERO
          </Typography>
          <SectionDivider dark />
          <Typography
            variant="body1"
            sx={{
              color: '#AAAAAA',
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
          </Typography>
        </Box>
      </Section>

      {/* About Me 섹션 */}
      <Section id="about-me">
        <SectionTitle>ABOUT ME</SectionTitle>
        <SectionDivider />
        <Typography
          variant="body1"
          sx={{
            color: '#666666',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          여기는 About Me 섹션입니다. 간단한 자기소개와 &apos;더 알아보기&apos; 버튼이 들어갈 예정입니다.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/about"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: '#000000',
            color: '#FFFFFF',
            px: 4,
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 0,
            '&:hover': { bgcolor: '#333333' },
          }}
        >
          더 알아보기
        </Button>
      </Section>

      {/* Skill Tree 섹션 */}
      <Section subtle id="skill-tree">
        <SectionTitle>SKILL TREE</SectionTitle>
        <SectionDivider />
        <Typography
          variant="body1"
          sx={{
            color: '#666666',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          여기는 Skill Tree 섹션입니다. 기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
        </Typography>
      </Section>

      {/* Projects 섹션 */}
      <Section dark id="projects">
        <SectionTitle dark>PROJECTS</SectionTitle>
        <SectionDivider />
        <Typography
          variant="body1"
          sx={{
            color: '#AAAAAA',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 &apos;더 보기&apos; 버튼이 들어갈 예정입니다.
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          to="/projects"
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: '#FFFFFF',
            borderColor: '#FFFFFF',
            px: 4,
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 0,
            '&:hover': {
              borderColor: '#C8102E',
              color: '#C8102E',
              bgcolor: 'transparent',
            },
          }}
        >
          더 보기
        </Button>
      </Section>

      {/* Contact 섹션 */}
      <Box
        id="contact"
        sx={{
          bgcolor: '#000000',
          color: '#FFFFFF',
          py: { xs: 8, md: 12 },
          px: 2,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <SectionTitle dark>CONTACT</SectionTitle>
          <SectionDivider dark />
          <Typography
            variant="body1"
            sx={{
              color: '#AAAAAA',
              fontSize: { xs: '1rem', md: '1.1rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 6,
            }}
          >
            함께 작업하고 싶으시다면 연락해 주세요. 방명록도 남겨주시면 감사하겠습니다.
          </Typography>
        </Container>
        <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
          <ContactSection />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#000000',
          color: '#666666',
          py: 3,
          textAlign: 'center',
          borderTop: '1px solid #333333',
        }}
      >
        <Typography variant="body2">
          &copy; 2026 Portfolio. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
