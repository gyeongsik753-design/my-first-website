import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Divider, Grid,
  Card, CardMedia, CardContent, CardActions,
  Chip, Button, Skeleton,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { supabase } from '../lib/supabase';
import AnimateOnScroll from '../components/AnimateOnScroll';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: '개인 포트폴리오 사이트',
    description: 'React + MUI로 제작한 반응형 포트폴리오. GitHub Pages 자동 배포 및 Supabase 방명록 기능 구현.',
    tech_stack: ['React', 'MUI', 'Supabase', 'GitHub Actions'],
    detail_url: 'https://gyeongsik753-design.github.io/my-first-website',
    github_url: 'https://github.com/gyeongsik753-design/my-first-website',
    sort_order: 1,
  },
  {
    id: 2,
    title: 'DUSK 패션 커뮤니티',
    description: '패션 커뮤니티 웹사이트. 다크 톤 디자인과 MUI 컴포넌트로 구성된 스타일리시한 UI.',
    tech_stack: ['React', 'MUI', 'Vite', 'CSS3'],
    detail_url: 'https://gyeongsik753-design.github.io',
    github_url: 'https://github.com/gyeongsik753-design',
    sort_order: 2,
  },
  {
    id: 3,
    title: '랜딩 페이지',
    description: '제품 소개 및 전환 최적화를 목표로 제작한 싱글 페이지 랜딩 사이트.',
    tech_stack: ['React', 'Vite', 'MUI'],
    detail_url: 'https://gyeongsik753-design.github.io/my-first-website',
    github_url: 'https://github.com/gyeongsik753-design/my-first-website',
    sort_order: 3,
  },
];

/* ════════════════════════════════════════════
   프로젝트 카드 — 이미지 줌 + 오버레이 + 3D 리프트
════════════════════════════════════════════ */
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
        /* GPU 가속 속성 사전 예약 */
        willChange: 'transform, box-shadow',
        /* 스프링 이징 — 탄력 있는 떠오름 */
        transition: [
          'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)',
          'box-shadow 0.38s ease',
          'border-color 0.28s ease',
        ].join(', '),
        '&:hover': {
          /* perspective + translateY 로 3D 효과 */
          transform: 'perspective(900px) translateY(-14px) rotateX(2deg)',
          boxShadow: [
            '0 30px 60px rgba(0,0,0,0.16)',
            '0 0 0 1px rgba(200,16,46,0.14)',
          ].join(', '),
          borderColor: 'rgba(200,16,46,0.22)',
        },
        /* 카드 hover → 이미지 줌 + 어두워짐 */
        '&:hover .proj-thumb': {
          transform: 'scale(1.09)',
          filter: 'brightness(0.6)',
        },
        /* 카드 hover → 오버레이 표시 */
        '&:hover .proj-overlay': { opacity: 1 },
        '&:hover .proj-overlay-content': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      }}
    >
      {/* ── 썸네일 + 인터랙티브 오버레이 ── */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1', flexShrink: 0 }}>
        {thumbnailUrl && !imgError ? (
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            className="proj-thumb"
            sx={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.55s ease, filter 0.45s ease',
              willChange: 'transform, filter',
            }}
          />
        ) : (
          <Box
            className="proj-thumb"
            sx={{
              width: '100%', height: '100%',
              bgcolor: '#F0F0F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'filter 0.45s ease',
            }}
          >
            <Typography variant="body2" color="text.secondary">미리보기 없음</Typography>
          </Box>
        )}

        {/* ── 이미지 위 호버 오버레이 ── */}
        <Box
          className="proj-overlay"
          aria-hidden="true"
          sx={{
            position: 'absolute', inset: 0,
            /* 아래서 위로 그라데이션 */
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)',
            display: 'flex', alignItems: 'flex-end',
            opacity: 0,
            transition: 'opacity 0.35s ease',
          }}
        >
          {/* 버튼 — 위로 슬라이드인 (stagger 0.06s) */}
          <Box
            className="proj-overlay-content"
            sx={{
              width: '100%',
              p: { xs: 2, md: 2.5 },
              display: 'flex', gap: 1.5, flexWrap: 'wrap',
              transform: 'translateY(18px)',
              opacity: 0,
              transition: 'transform 0.38s ease 0.06s, opacity 0.38s ease 0.06s',
            }}
          >
            {project.detail_url && (
              <Button
                component="a"
                href={project.detail_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="small"
                startIcon={<OpenInNewIcon fontSize="small" />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  bgcolor: '#C8102E', color: '#fff',
                  borderRadius: 0, fontWeight: 700, fontSize: '0.75rem', px: 2,
                  boxShadow: '0 0 18px rgba(200,16,46,0.5)',
                  '&:hover': { bgcolor: '#A00D25', transform: 'scale(1.04)' },
                }}
              >
                Live Demo
              </Button>
            )}
            {project.github_url && (
              <Button
                component="a"
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<GitHubIcon fontSize="small" />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.45)',
                  borderRadius: 0, fontWeight: 600, fontSize: '0.75rem', px: 2,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                GitHub
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── 카드 내용 ── */}
      <CardContent sx={{ flexGrow: 1, px: 3, py: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 1, color: '#111111' }}>
          {project.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.7, mb: 2, fontSize: '0.875rem' }}>
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
                bgcolor: '#111111', color: '#FFFFFF',
                fontWeight: 600, fontSize: '0.7rem',
                borderRadius: '4px', height: 24,
                willChange: 'transform, background-color',
                transition: 'transform 0.18s ease, background-color 0.18s ease',
                '& .MuiChip-label': { px: 1 },
                '&:hover': {
                  bgcolor: '#C8102E',
                  transform: 'scale(1.06)',
                  cursor: 'default',
                },
              }}
            />
          ))}
        </Box>
      </CardContent>

      {/* ── 하단 버튼 (항상 표시 — 모바일 touch 대응) ── */}
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
              bgcolor: '#C8102E', color: '#FFFFFF',
              fontWeight: 700, fontSize: '0.75rem',
              borderRadius: 0, px: 2, boxShadow: 'none',
              willChange: 'transform, box-shadow',
              transition: 'all 0.22s ease',
              '&:hover': {
                bgcolor: '#A00D25',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 14px rgba(200,16,46,0.4)',
              },
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
              color: '#111111', borderColor: '#111111',
              fontWeight: 700, fontSize: '0.75rem',
              borderRadius: 0, px: 2,
              willChange: 'transform',
              transition: 'all 0.22s ease',
              '&:hover': {
                bgcolor: '#111111', color: '#FFFFFF', borderColor: '#111111',
                transform: 'scale(1.05)',
              },
            }}
          >
            GitHub
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

/* ════════════════════════════════════════════
   스켈레톤 카드
════════════════════════════════════════════ */
/* ── wave 시머 애니메이션 스켈레톤 카드 ── */
const SkeletonCard = () => (
  <Card sx={{ height: '100%', border: '1px solid #E0E0E0', borderRadius: 0, boxShadow: 'none' }}>
    {/* animation="wave" → 좌→우 shimmer 효과 */}
    <Skeleton animation="wave" variant="rectangular" sx={{ aspectRatio: '1 / 1', width: '100%' }} />
    <CardContent sx={{ px: 3, py: 2.5 }}>
      <Skeleton animation="wave" variant="text" width="70%" height={28} />
      <Skeleton animation="wave" variant="text" width="100%" />
      <Skeleton animation="wave" variant="text" width="90%" />
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Skeleton animation="wave" variant="rectangular" width={60} height={24} />
        <Skeleton animation="wave" variant="rectangular" width={60} height={24} />
      </Box>
    </CardContent>
    <CardActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
      <Skeleton animation="wave" variant="rectangular" width={100} height={32} />
      <Skeleton animation="wave" variant="rectangular" width={90} height={32} />
    </CardActions>
  </Card>
);

/* ════════════════════════════════════════════
   Projects 페이지
════════════════════════════════════════════ */
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (supabaseError) {
          setProjects(FALLBACK_PROJECTS);
        } else {
          setProjects(data && data.length > 0 ? data : FALLBACK_PROJECTS);
        }
      } catch (err) {
        setProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{ bgcolor: '#000000', color: '#FFFFFF', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <AnimateOnScroll variant="fadeDown" duration={0.72}>
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' }, letterSpacing: '-0.02em' }}>
              PROJECTS
            </Typography>
            <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
            <Typography variant="body1" sx={{ color: '#AAAAAA', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
              직접 만든 작업물을 소개합니다
            </Typography>
          </AnimateOnScroll>
        </Container>
      </Box>

      {/* Projects — 수평 스크롤 */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>

          {/* ── 브랜드 로딩 스피너 ──
              로테이팅 arc + 텍스트
              skeleton UI 위에 별도 표시
          */}
          {loading && (
            <Box sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: 2, mb: 5,
            }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%',
                border: '3px solid rgba(200,16,46,0.16)',
                borderTopColor: '#C8102E',
                /* CSS @keyframes — 순수 CSS 회전 */
                animation: 'pSpin 0.72s linear infinite',
                '@keyframes pSpin': { '100%': { transform: 'rotate(360deg)' } },
              }} />
              <Typography sx={{
                color: '#999', fontSize: '0.85rem',
                letterSpacing: 0.5, fontWeight: 500,
              }}>
                프로젝트 불러오는 중...
              </Typography>
            </Box>
          )}

          {/* 카드 목록 */}
          <Box
            sx={{
              display: 'flex', gap: 3, overflowX: 'auto', pb: 2,
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-track': { bgcolor: '#F5F5F5' },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#BDBDBD', borderRadius: 3 },
            }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} sx={{ minWidth: { xs: '85vw', sm: 340, md: 380 }, flexShrink: 0 }}>
                    <SkeletonCard />
                  </Box>
                ))
              : projects.map((project) => (
                  <Box key={project.id} sx={{ minWidth: { xs: '85vw', sm: 340, md: 380 }, flexShrink: 0 }}>
                    <ProjectCard project={project} />
                  </Box>
                ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#000000', color: '#666666', py: 3, textAlign: 'center', borderTop: '1px solid #333333' }}>
        <Typography variant="body2">&copy; 2026 Portfolio. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Projects;
