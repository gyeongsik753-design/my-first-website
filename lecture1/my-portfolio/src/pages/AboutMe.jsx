import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Box, Typography, Container, Divider, Card, CardContent,
  Avatar, Grid, Chip, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Slider, Snackbar, Alert,
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
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { usePortfolio, CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';

/* ─── 기본 정보 행 (memo: props 동일 시 리렌더 방지) ─── */
const InfoRow = memo(({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2 }}>
    <Box sx={{ color: '#C8102E', display: 'flex', flexShrink: 0 }} aria-hidden="true">{icon}</Box>
    <Typography variant="body2" sx={{ color: '#999', minWidth: 48, flexShrink: 0 }}>{label}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 600, color: '#111' }}>{value || '—'}</Typography>
  </Box>
));

/* ─── 스킬 바 (memo) ─── */
const SkillBar = memo(({ skill, animate }) => {
  const cat = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Design;
  const levelLabel = skill.level <= 30 ? '기초 · 학습 중' : skill.level <= 60 ? '중급 · 성장 중' : '상급';

  /* ── rAF 숫자 카운팅: animate prop 트리거 ──
     진행 바와 숫자가 동시에 증가하는 효과
  */
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let rafId, t0;
    const dur = 1400;
    const tgt = skill.level;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(e * tgt));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [animate, skill.level]);

  return (
    <Tooltip title={skill.description || skill.name} placement="top" arrow>
      <Card
        elevation={0}
        role="article"
        aria-label={`${skill.name}, 숙련도 ${skill.level}퍼센트, ${levelLabel}`}
        sx={{
          border: '1px solid #E0E0E0', borderRadius: 0, p: 2.5, cursor: 'default',
          /* GPU 가속 예약 */
          willChange: 'transform, box-shadow',
          /* 스프링 이징 */
          transition: [
            'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'box-shadow 0.4s ease',
            'border-color 0.28s ease',
          ].join(', '),
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 36px ${cat.color}22, 0 0 0 1px ${cat.color}1A`,
            borderColor: `${cat.color}35`,
          },
          /* 카드 hover → 아이콘 회전 + glow */
          '&:hover .skill-icon-box': {
            transform: 'rotate(-8deg) scale(1.18)',
            boxShadow: `0 0 20px ${cat.color}60`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            className="skill-icon-box"
            sx={{
              width: 36, height: 36, borderRadius: '50%',
              bgcolor: cat.bg, color: cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'transform 0.32s ease, box-shadow 0.32s ease',
              willChange: 'transform, box-shadow',
            }}
            aria-hidden="true"
          >
            {ICON_MAP[skill.icon] || ICON_MAP.CodeIcon}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111', fontSize: '0.85rem' }}>{skill.name}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: cat.color, ml: 1, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">{count}%</Typography>
            </Box>
            <Chip label={cat.label} size="small" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, fontSize: '0.65rem', height: 18, mt: 0.3 }} />
          </Box>
          {skill.showInMain && (
            <Tooltip title="메인 표시 중" placement="top">
              <StarIcon sx={{ fontSize: 16, color: '#FFC107', flexShrink: 0 }} aria-label="메인 표시 중" />
            </Tooltip>
          )}
        </Box>

        {/* 프로그레스 바 */}
        <Box
          role="progressbar"
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} 숙련도`}
          sx={{ position: 'relative', height: 6, bgcolor: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}
        >
          <Box
            sx={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              bgcolor: cat.color, borderRadius: 3,
              width: animate ? `${skill.level}%` : '0%',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: '#999', mt: 0.8, display: 'block' }}>
          {levelLabel}
        </Typography>
      </Card>
    </Tooltip>
  );
});

/* ─── 메인 컴포넌트 ─── */
const AboutMe = () => {
  const { aboutMeData, updateSectionContent, addSkill, updatePhoto } = usePortfolio();
  const { basicInfo, sections, skills } = aboutMeData;

  const [expanded, setExpanded]       = useState('dev-story');
  const [editingId, setEditingId]     = useState(null);
  const [editDraft, setEditDraft]     = useState('');
  const [sortAsc, setSortAsc]         = useState(false);
  const [animate, setAnimate]         = useState(false);
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [snackOpen, setSnackOpen]     = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [newSkill, setNewSkill]       = useState({ name: '', level: 50, category: 'Design', icon: 'CodeIcon', description: '' });

  const fileInputRef = useRef(null);
  const skillsRef    = useRef(null);
  const editFieldRef = useRef(null);

  /* 스킬 섹션 IntersectionObserver */
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* 편집 모드 진입 시 TextField 포커스 */
  useEffect(() => {
    if (editingId && editFieldRef.current) {
      const input = editFieldRef.current.querySelector('textarea');
      input?.focus();
    }
  }, [editingId]);

  /* 사진 업로드 */
  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      updatePhoto(ev.target.result);
      setPhotoLoading(false);
    };
    reader.onerror = () => setPhotoLoading(false);
    reader.readAsDataURL(file);
  }, [updatePhoto]);

  /* 섹션 편집 시작 */
  const handleEditStart = useCallback((section) => {
    setEditingId(section.id);
    setEditDraft(section.content);
    setExpanded(section.id);
  }, []);

  /* 섹션 편집 저장 → Context 업데이트 → 홈 즉시 반영 */
  const handleEditSave = useCallback((id) => {
    updateSectionContent(id, editDraft);
    setEditingId(null);
    setSnackOpen(true);   /* 저장 완료 피드백 */
  }, [updateSectionContent, editDraft]);

  /* 키보드 단축키: Ctrl/Cmd + Enter = 저장, Escape = 취소 */
  const handleKeyDown = useCallback((e, id) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleEditSave(id);
    }
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  }, [handleEditSave]);

  /* 스킬 추가 */
  const handleAddSkill = useCallback(() => {
    if (!newSkill.name.trim()) return;
    addSkill(newSkill);
    setNewSkill({ name: '', level: 50, category: 'Design', icon: 'CodeIcon', description: '' });
    setDialogOpen(false);
  }, [addSkill, newSkill]);

  /* useMemo: 정렬·그룹핑 계산 결과 캐싱 */
  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => sortAsc ? a.level - b.level : b.level - a.level),
    [skills, sortAsc],
  );

  const grouped = useMemo(
    () => sortedSkills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {}),
    [sortedSkills],
  );

  return (
    <Box>
      {/* Hero */}
      <Box component="section" aria-labelledby="about-hero-title"
        sx={{ bgcolor: '#000', color: '#fff', py: { xs: 8, md: 12 }, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography id="about-hero-title" variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' }, letterSpacing: '-0.02em' }}>
            ABOUT ME
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', my: 3, borderColor: '#C8102E', borderWidth: 2 }} />
          <Typography variant="body1" sx={{ color: '#AAA', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
            나를 소개합니다
          </Typography>
        </Container>
      </Box>

      {/* 기본 정보 */}
      <Box component="section" aria-label="기본 정보" sx={{ bgcolor: '#F7F7F7', py: { xs: 6, md: 8 }, px: 2 }}>
        <Container maxWidth="md">
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 0 }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} sm="auto" sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={basicInfo.photo || undefined}
                      sx={{
                        width: 120, height: 120, bgcolor: '#E0E0E0', border: '3px solid #111',
                        opacity: photoLoading ? 0.5 : 1,
                        transition: 'opacity 0.3s',
                      }}
                      alt={`${basicInfo.name} 프로필 사진`}
                    >
                      {!basicInfo.photo && <PersonIcon sx={{ fontSize: '3rem', color: '#999' }} aria-hidden="true" />}
                    </Avatar>
                    <Tooltip title="사진 업로드 (클릭)">
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        size="small"
                        aria-label="프로필 사진 업로드"
                        disabled={photoLoading}
                        sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#C8102E', color: '#fff', width: 32, height: 32, '&:hover': { bgcolor: '#A00D25' } }}
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
                      aria-hidden="true"
                    />
                  </Box>
                </Grid>

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

      {/* MY STORY 아코디언 */}
      <Box component="section" aria-label="나의 스토리" sx={{ bgcolor: '#fff', py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 3 }}>
              MY STORY
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              ✏️ 클릭하여 수정 · Ctrl+Enter 저장 · 홈 탭에 즉시 반영됩니다
            </Typography>
          </Box>

          {/* 스크린 리더용 라이브 영역 */}
          <Box role="status" aria-live="polite" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            {editingId ? '편집 모드입니다' : ''}
          </Box>

          {sections.map((section, idx) => (
            <Accordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={(_, isOpen) => {
                setExpanded(isOpen ? section.id : false);
                if (!isOpen) setEditingId(null);
              }}
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
                aria-controls={`section-${section.id}-content`}
                id={`section-${section.id}-header`}
                sx={{
                  px: { xs: 2.5, md: 4 }, py: 1.5,
                  bgcolor: expanded === section.id ? '#111' : '#fff',
                  color: expanded === section.id ? '#fff' : '#111',
                  transition: 'background-color 0.25s ease, color 0.25s ease',
                  '& .MuiAccordionSummary-expandIconWrapper': { color: expanded === section.id ? '#fff' : '#111' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>{section.title}</Typography>
                  {section.showInHome && (
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                      label="홈 표시"
                      size="small"
                      aria-label="홈 탭에 표시되는 섹션"
                      sx={{
                        bgcolor: expanded === section.id ? '#C8102E' : '#F0F0F0',
                        color: expanded === section.id ? '#fff' : '#555',
                        fontWeight: 700, fontSize: '0.7rem', height: 22, mr: 1,
                      }}
                    />
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails
                id={`section-${section.id}-content`}
                role="region"
                aria-labelledby={`section-${section.id}-header`}
                sx={{ px: { xs: 2.5, md: 4 }, py: 3, bgcolor: '#FAFAFA' }}
              >
                {editingId === section.id ? (
                  /* 편집 모드 */
                  <Box>
                    <TextField
                      ref={editFieldRef}
                      fullWidth
                      multiline
                      minRows={3}
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, section.id)}
                      placeholder="내용을 입력하세요…"
                      inputProps={{ 'aria-label': `${section.title} 내용 편집` }}
                      helperText="Ctrl+Enter 저장 · Esc 취소"
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={() => handleEditSave(section.id)}
                        sx={{ bgcolor: '#111', borderRadius: 0, '&:hover': { bgcolor: '#333' } }}
                      >
                        저장
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={() => setEditingId(null)}
                        sx={{ borderColor: '#ccc', color: '#555', borderRadius: 0 }}
                      >
                        취소
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  /* 읽기 모드 */
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      {section.content
                        ? (
                          <Typography variant="body1" sx={{ color: '#444', lineHeight: 2 }}>
                            {section.content}
                          </Typography>
                        )
                        : (
                          <Typography variant="body2" sx={{ color: '#BDBDBD', fontStyle: 'italic' }}>
                            아직 작성된 내용이 없습니다. ✏️ 를 눌러 추가해보세요.
                          </Typography>
                        )
                      }
                    </Box>
                    <Tooltip title="내용 수정 (클릭)">
                      <IconButton
                        size="small"
                        onClick={() => handleEditStart(section)}
                        aria-label={`${section.title} 내용 수정`}
                        sx={{ color: '#999', '&:hover': { color: '#C8102E' }, flexShrink: 0 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* SKILLS */}
      <Box
        ref={skillsRef}
        component="section"
        aria-label="기술 스택"
        sx={{ bgcolor: '#F7F7F7', py: { xs: 6, md: 10 }, px: 2 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#C8102E', fontWeight: 700, letterSpacing: 3, display: 'block' }}>SKILLS</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>기술 스택</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={sortAsc ? '숙련도 높은 순으로 보기' : '숙련도 낮은 순으로 보기'}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SortIcon />}
                  onClick={() => setSortAsc((v) => !v)}
                  aria-label={sortAsc ? '숙련도 높은 순으로 정렬' : '숙련도 낮은 순으로 정렬'}
                  sx={{ borderColor: '#111', color: '#111', borderRadius: 0, fontWeight: 700, '&:hover': { bgcolor: '#111', color: '#fff' } }}
                >
                  {sortAsc ? '낮은 순' : '높은 순'}
                </Button>
              </Tooltip>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                aria-label="새 스킬 추가"
                sx={{ bgcolor: '#C8102E', borderRadius: 0, fontWeight: 700, '&:hover': { bgcolor: '#A00D25' } }}
              >
                스킬 추가
              </Button>
            </Box>
          </Box>

          {Object.entries(grouped).map(([category, catSkills]) => {
            const cat = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Design;
            return (
              <Box key={category} sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 4, height: 20, bgcolor: cat.color, borderRadius: 2 }} aria-hidden="true" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: cat.color }}>{cat.label}</Typography>
                  <Chip
                    label={`${catSkills.length}개`}
                    size="small"
                    aria-label={`${cat.label} 카테고리 스킬 ${catSkills.length}개`}
                    sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, height: 20, fontSize: '0.7rem' }}
                  />
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

      {/* 스킬 추가 다이얼로그 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="add-skill-dialog-title"
      >
        <DialogTitle id="add-skill-dialog-title" sx={{ fontWeight: 700 }}>스킬 추가</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          <TextField
            label="기술명"
            fullWidth
            size="small"
            value={newSkill.name}
            onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
            autoFocus
            inputProps={{ 'aria-label': '기술명 입력' }}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="category-label">카테고리</InputLabel>
            <Select
              labelId="category-label"
              label="카테고리"
              value={newSkill.category}
              onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
            >
              {Object.keys(CATEGORY_CONFIG).map((c) => (
                <MenuItem key={c} value={c}>{CATEGORY_CONFIG[c].label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="icon-label">아이콘</InputLabel>
            <Select
              labelId="icon-label"
              label="아이콘"
              value={newSkill.icon}
              onChange={(e) => setNewSkill((p) => ({ ...p, icon: e.target.value }))}
            >
              {Object.keys(ICON_MAP).map((k) => (
                <MenuItem key={k} value={k}>{k.replace('Icon', '')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>
              숙련도: <strong aria-live="polite">{newSkill.level}%</strong>
            </Typography>
            <Slider
              value={newSkill.level}
              min={0}
              max={100}
              step={5}
              onChange={(_, v) => setNewSkill((p) => ({ ...p, level: v }))}
              aria-label="숙련도"
              valueLabelDisplay="auto"
              sx={{ color: '#C8102E' }}
            />
          </Box>
          <TextField
            label="툴팁 설명 (선택)"
            fullWidth
            size="small"
            value={newSkill.description}
            onChange={(e) => setNewSkill((p) => ({ ...p, description: e.target.value }))}
            inputProps={{ 'aria-label': '스킬 설명 입력 (선택사항)' }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#666' }}>취소</Button>
          <Button
            onClick={handleAddSkill}
            variant="contained"
            disabled={!newSkill.name.trim()}
            sx={{ bgcolor: '#C8102E', '&:hover': { bgcolor: '#A00D25' }, borderRadius: 0, fontWeight: 700 }}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* 저장 완료 스낵바 */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 0, fontWeight: 600 }}
          role="status"
        >
          저장됐습니다 · 홈 탭에 즉시 반영됩니다 ✓
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#000', color: '#666', py: 3, textAlign: 'center', borderTop: '1px solid #333' }}>
        <Typography variant="body2">&copy; 2026 Portfolio. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default AboutMe;
