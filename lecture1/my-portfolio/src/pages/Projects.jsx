import { Box, Typography, Container, Divider } from '@mui/material';

const Projects = () => {
  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          bgcolor: '#000000',
          color: '#FFFFFF',
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            PROJECTS
          </Typography>
          <Divider
            sx={{
              width: 60,
              mx: 'auto',
              my: 3,
              borderColor: '#C8102E',
              borderWidth: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#AAAAAA',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
            }}
          >
            작업물을 소개합니다
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          py: { xs: 8, md: 12 },
          px: 2,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              border: '1px solid #E0E0E0',
              p: { xs: 4, md: 6 },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#666666',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 2,
              }}
            >
              Projects 페이지가 개발될 공간입니다. 포트폴리오 작품들이 들어갈 예정입니다.
            </Typography>
          </Box>
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

export default Projects;
