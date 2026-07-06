import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Container, Divider, Card, CardContent,
  Avatar, Grid, Chip, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Slider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import StarIcon from '@mui/icons-material/Star';
import BrushIcon from '@mui/icons-material/Brush';
import GestureIcon from '@mui/icons-material/Gesture';
import GridViewIcon from '@mui/icons-material/GridView';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';

/* ─────────────────── 카테고리 설정 ─────────────────── */
const CATEGORY_CONFIG = {
  Design:    { color: '#C8102E', bg: '#FFF0F0', label: 'Design'    },
  Frontend:  { color: '#1565C0', bg: '#E8F0FE', label: 'Frontend'  },
  Framework: { color: '#2E7D32', bg: '#E8F5E9', label: 'Framework' },
  Backend:   { color: '#E65100', bg: '#FFF3E0', label: 'Backend'   },
  Tools:     { color: '#6A1B9A', bg: '#F3E5F5', label: 'Tools'     },
};

const ICON_MAP = {
  BrushIcon:    <BrushIcon />,
  GestureIcon:  <GestureIcon />,
  GridViewIcon: <GridViewIcon />,
  CodeIcon:     <CodeIcon />,
  StorageIcon:  <StorageIcon />,
  BuildIcon:    <BuildIcon />,
};

/* ─────────────────── 데이터 ─────────────────── */
const initialSkills = [
  { id: 1, icon: 'BrushIcon',    name: 'Adobe Photoshop',   level: 30, category: 'Design',   description: '사진 편집 및 합성 작업 가능', showInMain: false },
  { id: 2, icon: 'GestureIcon',  name: 'Adobe Illustrator', level: 30, category: 'Design',   description: '벡터 그래픽 및 로고 제작 가능', showInMain: false },
  { id: 3, icon: 'GridViewIcon', name: 'Figma',             level: 60, category: 'Design',   description: 'UI/UX 프로토타입 설계 가능', showInMain: true  },
];

const aboutMeData = {
  basicInfo: {
    name: '신경식',
    education: '마산대학교 호텔조리과 (전문대)',
    major: '조리',
    experience: '신입',
    photo: '',
  },
  sections: [
    { id: 'dev-story', title: '나의 개발 스토리',  content: '컴퓨터 관련 일을 찾아보다가 관심이 생겼습니다.', showInHome: true  },
    { id: 'philosophy', title: '개발 철학',        content: '표현하고 싶은 부분은 확실하게 표현합니다.',       showInHome: true  },
    { id: 'personal',   title: '개인적인 이야기',  content: '',                                               showInHome: false },
  ],
};

/* ─────────────────── 기본 정보 행 ─────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2 }}>
    <Box sx={{ color: '#C8102E', display: 'flex', flexShrink: 0 }}>{icon}</Box>
    <Typography variant="body2" sx={{ color: '#999', minWidth: 48, flexShrink: 0 }}>{label}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 600, color: '#111' }}>{value}</Typography>
  </Box>
);

/* ─────────────────── 스킬 바 컴포넌트 ─────────────────── */
const SkillBar = ({ skill, animate }) => {
  const cat = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Design;
  return (
    <Tooltip title={skill.description || skill.name} placement="top" arrow>
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: 0,
          p: 2.5,
          cursor: 'default',
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' },
        }}
      >
        {/* 아이콘 + 이름 + 레벨 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '50%',
              bgcolor: cat.bg, color: cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            {ICON_MAP[skill.icon] || <CodeIcon />}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111', fontSize: '0.85rem' }}>
                {skill.name}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: cat.color, ml: 1, flexShrink: 0 }}>
                {skill.level}%
              </Typography>
            </Box>
            <Chip
              label={cat.label}
              size="small"
              sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, fontSize: '0.65rem', height: 18, mt: 0.3 }}
            />
          </Box>
          {skill.showInMain && (
            <Tooltip title="메인 표시 중" placement="top">
              <StarIcon sx={{ fontSize: 16, color: '#FFC107', flexShrink: 0 }} />
            </Tooltip>
          )}
        </Box>

        {/* 프로그레스 바 */}
        <Box sx={{ position: 'relative', height: 6, bgcolor: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              bgcolor: cat.color, borderRadius: 3,
              width: animate ? `${skill.level}%` : '0%',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>

        {/* 수준 텍스트 */}
        <Typography variant="caption" sx={{ color: '#999', mt: 0.8, display: 'block' }}>
          {skill.level <= 30 ? '기초 · 학습 중' : skill.level <= 60 ? '중급 · 성장 중' : '상급'}
        </Typography>
      </Card>
    </Tooltip>
  );
};

/* ─────────────────── 메인 컴포넌트 ─────────────────── */
const AboutMe = () => {
  const [data, setData] = useState(aboutMeData);
  const [expanded, setExpanded] = useState('dev-story');
  const [skills, setSkills] = useState(initialSkills);
  const [sortAsc, setSortAsc] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'Design', icon: 'CodeIcon', description: '' });
  const fileInputRef = useRef(null);
  const skillsRef = useRef(null);

  /* 스킬 섹션 스크롤 진입 시 애니메이션 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  /* 사진 업로드 */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setData((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, photo: ev.target.result } }));
    reader.readAsDataURL(file);
  };

  /* 스킬 추가 */
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills((prev) => [...prev, { ...newSkill, id: Date.now(), showInMain: false }]);
    setNewSkill({ name: '', level: 50, category: 'Design', icon: 'CodeIcon', description: '' });
    setDialogOpen(false);
  };

  /* 정렬 */
  const sortedSkills = [...skills].sort((a, b) => sortAsc ? a.level - b.level : b.level - a.level);

  /* 카테고리 그룹 */
  const grouped = sortedSkills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const { basicInfo, sections } = data;

  return (
    <Box>
      {/* ── Hero Banner ── */}
      <Box sx={{ bgcolor: '#000000', color: '#FFFFFF', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' }, letterSpacing: '-0.02em' }}>
            ABOUT ME
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
          <Typography variant="body1" sx={{ color: '#AAAAAA', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
            나를 소개합니다
          </Typography>
        </Container>
      </Box>

      {/* ── 기본 정보 ── */}
      <Box sx={{ bgcolor: '#F7F7F7', py: { xs: 6, md: 8 }, px: 2 }}>
        <Container maxWidth="md">
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 0 }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={4} alignItems="center">
                {/* 사진 */}
                <Grid item xs={12} sm="auto" sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={basicInfo.photo || undefined}
                      sx={{ width: 120, height: 120, bgcolor: '#E0E0E0', border: '3px solid #111' }}
                    >
                      {!basicInfo.photo && <PersonIcon sx={{ fontSize: '3rem', color: '#999' }} />}
                    </Avatar>
                    <Tooltip title="사진 업로드">
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        size="small"
                        sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#C8102E', color: '#fff', width: 32, height: 32, '&:hover': { bgcolor: '#A00D25' } }}
                      >
                        <AddPhotoAlternateIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </Box>
                </Grid>
                {/* 정보 */}
                <Grid item xs={12} sm>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.01em' }}>{basicInfo.name}</Typography>
                  <Divider sx={{ mb: 2, borderColor: '#E0E0E0' }} />
                  <InfoRow icon={<SchoolIcon fontSize="small" />} label="학력" value={basicInfo.education} />
                  <InfoRow icon={<SchoolIcon fontSize="small" />} label="전공" value={basicInfo.major} />
                  <InfoRow icon={<WorkIcon fontSize="small" />}   label="경력" value={basicInfo.experience} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* ── MY STORY 아코디언 ── */}
      <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 3, display: 'block', mb: 3 }}>
            MY STORY
          </Typography>
          {sections.map((section, idx) => (
            <Accordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={(_, isOpen) => setExpanded(isOpen ? section.id : false)}
              elevation={0} disableGutters
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
                  px: { xs: 2.5, md: 4 }, py: 1.5,
                  bgcolor: expanded === section.id ? '#111' : '#FFFFFF',
                  color: expanded === section.id ? '#FFFFFF' : '#111',
                  transition: 'all 0.25s ease',
                  '& .MuiAccordionSummary-expandIconWrapper': { color: expanded === section.id ? '#FFFFFF' : '#111' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>{section.title}</Typography>
                  {section.showInHome && (
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                      label="홈 표시" size="small"
                      sx={{ bgcolor: expanded === section.id ? '#C8102E' : '#F0F0F0', color: expanded === section.id ? '#fff' : '#555', fontWeight: 700, fontSize: '0.7rem', height: 22, mr: 1 }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2.5, md: 4 }, py: 3, bgcolor: '#FAFAFA' }}>
                {section.content
                  ? <Typography variant="body1" sx={{ color: '#444', lineHeight: 2 }}>{section.content}</Typography>
                  : <Typography variant="body2" sx={{ color: '#BDBDBD', fontStyle: 'italic' }}>아직 작성된 내용이 없습니다.</Typography>
                }
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ── SKILLS 섹션 ── */}
      <Box ref={skillsRef} sx={{ bgcolor: '#F7F7F7', py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          {/* 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 3, display: 'block' }}>
                SKILLS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                기술 스택
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={sortAsc ? '숙련도 높은 순' : '숙련도 낮은 순'}>
                <Button
                  variant="outlined" size="small" startIcon={<SortIcon />}
                  onClick={() => setSortAsc((v) => !v)}
                  sx={{ borderColor: '#111', color: '#111', borderRadius: 0, fontWeight: 700, '&:hover': { bgcolor: '#111', color: '#fff' } }}
                >
                  {sortAsc ? '낮은 순' : '높은 순'}
                </Button>
              </Tooltip>
              <Button
                variant="contained" size="small" startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ bgcolor: '#C8102E', borderRadius: 0, fontWeight: 700, '&:hover': { bgcolor: '#A00D25' } }}
              >
                스킬 추가
              </Button>
            </Box>
          </Box>

          {/* 카테고리별 그룹 */}
          {Object.entries(grouped).map(([category, catSkills]) => {
            const cat = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Design;
            return (
              <Box key={category} sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 4, height: 20, bgcolor: cat.color, borderRadius: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: cat.color }}>
                    {cat.label}
                  </Typography>
                  <Chip label={`${catSkills.length}개`} size="small" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 20, fontSize: '0.7rem' }} />
                </Box>
                <Grid container spacing={2}>
                  {catSkills.map((skill) => (
                    <Grid item xs={12} sm={6} md={4} key={skill.id}>
                      <SkillBar skill={skill} animate={animate} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* ── 스킬 추가 다이얼로그 ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>스킬 추가</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <TextField
            label="기술명" fullWidth size="small" value={newSkill.name}
            onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
          />
          <FormControl fullWidth size="small">
            <InputLabel>카테고리</InputLabel>
            <Select
              label="카테고리" value={newSkill.category}
              onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
            >
              {Object.keys(CATEGORY_CONFIG).map((c) => (
                <MenuItem key={c} value={c}>{CATEGORY_CONFIG[c].label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>아이콘</InputLabel>
            <Select
              label="아이콘" value={newSkill.icon}
              onChange={(e) => setNewSkill((p) => ({ ...p, icon: e.target.value }))}
            >
              {Object.keys(ICON_MAP).map((k) => (
                <MenuItem key={k} value={k}>{k.replace('Icon', '')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>숙련도: <strong>{newSkill.level}%</strong></Typography>
            <Slider
              value={newSkill.level} min={0} max={100} step={5}
              onChange={(_, v) => setNewSkill((p) => ({ ...p, level: v }))}
              sx={{ color: '#C8102E' }}
            />
          </Box>
          <TextField
            label="툴팁 설명 (선택)" fullWidth size="small" value={newSkill.description}
            onChange={(e) => setNewSkill((p) => ({ ...p, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#666' }}>취소</Button>
          <Button
            onClick={handleAddSkill} variant="contained" disabled={!newSkill.name.trim()}
            sx={{ bgcolor: '#C8102E', '&:hover': { bgcolor: '#A00D25' }, borderRadius: 0, fontWeight: 700 }}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Footer ── */}
      <Box component="footer" sx={{ bgcolor: '#000000', color: '#666666', py: 3, textAlign: 'center', borderTop: '1px solid #333333' }}>
        <Typography variant="body2">&copy; 2026 Portfolio. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default AboutMe;
