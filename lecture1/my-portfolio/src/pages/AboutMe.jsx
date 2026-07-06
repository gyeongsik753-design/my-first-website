import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

/* ───────────────────────── 데이터 ───────────────────────── */
const aboutMeData = {
  basicInfo: {
    name: '신경식',
    education: '마산대학교 호텔조리과 (전문대)',
    major: '조리',
    experience: '신입',
    photo: '',
  },
  sections: [
    {
      id: 'dev-story',
      title: '나의 개발 스토리',
      content: '컴퓨터 관련 일을 찾아보다가 관심이 생겼습니다.',
      showInHome: true,
    },
    {
      id: 'philosophy',
      title: '개발 철학',
      content: '표현하고 싶은 부분은 확실하게 표현합니다.',
      showInHome: true,
    },
    {
      id: 'personal',
      title: '개인적인 이야기',
      content: '',
      showInHome: false,
    },
  ],
};

/* ───────────────────── 기본 정보 카드 ───────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2 }}>
    <Box sx={{ color: '#C8102E', display: 'flex', flexShrink: 0 }}>{icon}</Box>
    <Typography variant="body2" sx={{ color: '#999', minWidth: 48, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 600, color: '#111' }}>
      {value}
    </Typography>
  </Box>
);

/* ─────────────────────── 메인 컴포넌트 ─────────────────── */
const AboutMe = () => {
  const [data, setData] = useState(aboutMeData);
  const [expanded, setExpanded] = useState('dev-story');
  const fileInputRef = useRef(null);

  /* 사진 업로드 */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, photo: ev.target.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const { basicInfo, sections } = data;

  return (
    <Box>
      {/* ── Hero Banner ── */}
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
            ABOUT ME
          </Typography>
          <Divider
            sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }}
          />
          <Typography
            variant="body1"
            sx={{ color: '#AAAAAA', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}
          >
            나를 소개합니다
          </Typography>
        </Container>
      </Box>

      {/* ── 기본 정보 + 사진 ── */}
      <Box sx={{ bgcolor: '#F7F7F7', py: { xs: 6, md: 8 }, px: 2 }}>
        <Container maxWidth="md">
          <Card
            elevation={0}
            sx={{ border: '1px solid #E0E0E0', borderRadius: 0 }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={4} alignItems="center">
                {/* 프로필 사진 */}
                <Grid item xs={12} sm="auto" sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={basicInfo.photo || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: '#E0E0E0',
                        border: '3px solid #111',
                        fontSize: '3rem',
                      }}
                    >
                      {!basicInfo.photo && <PersonIcon sx={{ fontSize: '3rem', color: '#999' }} />}
                    </Avatar>
                    <Tooltip title="사진 업로드">
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: '#C8102E',
                          color: '#fff',
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: '#A00D25' },
                        }}
                      >
                        <AddPhotoAlternateIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                </Grid>

                {/* 기본 정보 */}
                <Grid item xs={12} sm>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.01em' }}
                  >
                    {basicInfo.name}
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: '#E0E0E0' }} />
                  <InfoRow
                    icon={<SchoolIcon fontSize="small" />}
                    label="학력"
                    value={basicInfo.education}
                  />
                  <InfoRow
                    icon={<SchoolIcon fontSize="small" />}
                    label="전공"
                    value={basicInfo.major}
                  />
                  <InfoRow
                    icon={<WorkIcon fontSize="small" />}
                    label="경력"
                    value={basicInfo.experience}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* ── 콘텐츠 섹션 (아코디언) ── */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 3, display: 'block', mb: 3 }}
          >
            MY STORY
          </Typography>

          {sections.map((section, idx) => (
            <Accordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={(_, isOpen) => setExpanded(isOpen ? section.id : false)}
              elevation={0}
              disableGutters
              sx={{
                border: '1px solid #E0E0E0',
                borderBottom: idx < sections.length - 1 ? 'none' : '1px solid #E0E0E0',
                borderRadius: '0 !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: { xs: 2.5, md: 4 },
                  py: 1.5,
                  bgcolor: expanded === section.id ? '#111' : '#FFFFFF',
                  color: expanded === section.id ? '#FFFFFF' : '#111',
                  transition: 'all 0.25s ease',
                  '& .MuiAccordionSummary-expandIconWrapper': {
                    color: expanded === section.id ? '#FFFFFF' : '#111',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
                    {section.title}
                  </Typography>
                  {section.showInHome && (
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                      label="홈 표시"
                      size="small"
                      sx={{
                        bgcolor: expanded === section.id ? '#C8102E' : '#F0F0F0',
                        color: expanded === section.id ? '#fff' : '#555',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                        mr: 1,
                      }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2.5, md: 4 }, py: 3, bgcolor: '#FAFAFA' }}>
                {section.content ? (
                  <Typography
                    variant="body1"
                    sx={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}
                  >
                    {section.content}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#BDBDBD', fontStyle: 'italic' }}>
                    아직 작성된 내용이 없습니다.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ── Footer ── */}
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

export default AboutMe;
