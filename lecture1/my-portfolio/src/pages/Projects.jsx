import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { supabase } from '../lib/supabase';

const ProjectCard = ({ project }) => {
  const [imgError, setImgError] = useState(false);

  const thumbnailUrl = project.detail_url
    ? `https://image.thum.io/get/${project.detail_url}`
    : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E0E0E0',
        borderRadius: 0,
        boxShadow: 'none',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* 썸네일 */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
        {thumbnailUrl && !imgError ? (
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              미리보기 없음
            </Typography>
          </Box>
        )}
      </Box>

      {/* 카드 내용 */}
      <CardContent sx={{ flexGrow: 1, px: 3, py: 2.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: '1rem', mb: 1, color: '#111111' }}
        >
          {project.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#666666', lineHeight: 1.7, mb: 2, fontSize: '0.875rem' }}
        >
          {project.description}
        </Typography>

        {/* 기술 스택 뱃지 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {(project.tech_stack || []).map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                bgcolor: '#111111',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.7rem',
                borderRadius: '4px',
                height: 24,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Box>
      </CardContent>

      {/* 버튼 */}
      <CardActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        {project.detail_url && (
          <Button
            variant="contained"
            size="small"
            href={project.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              bgcolor: '#C8102E',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 0,
              px: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#A00D25',
                boxShadow: 'none',
                transform: 'scale(1.03)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Live Demo
          </Button>
        )}
        {project.github_url && (
          <Button
            variant="outlined"
            size="small"
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GitHubIcon fontSize="small" />}
            sx={{
              color: '#111111',
              borderColor: '#111111',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 0,
              px: 2,
              '&:hover': {
                bgcolor: '#111111',
                color: '#FFFFFF',
                borderColor: '#111111',
                transform: 'scale(1.03)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            GitHub
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const SkeletonCard = () => (
  <Card
    sx={{
      height: '100%',
      border: '1px solid #E0E0E0',
      borderRadius: 0,
      boxShadow: 'none',
    }}
  >
    <Skeleton variant="rectangular" sx={{ aspectRatio: '1 / 1', width: '100%' }} />
    <CardContent sx={{ px: 3, py: 2.5 }}>
      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </Box>
    </CardContent>
    <CardActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
      <Skeleton variant="rectangular" width={100} height={32} />
      <Skeleton variant="rectangular" width={90} height={32} />
    </CardActions>
  </Card>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (supabaseError) throw supabaseError;
        setProjects(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
            직접 만든 작업물을 소개합니다
          </Typography>
        </Container>
      </Box>

      {/* Projects Grid */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              프로젝트를 불러오는 중 오류가 발생했습니다: {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <SkeletonCard />
                  </Grid>
                ))
              : projects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}

            {!loading && !error && projects.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    등록된 프로젝트가 없습니다.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
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
