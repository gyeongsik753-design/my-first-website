import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Chip,
  MenuItem,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../lib/supabase';

const EMOJIS = ['👋', '🔥', '🖤', '✨', '💫', '🤙', '👑', '💀'];

const REFERRAL_OPTIONS = [
  '검색 (구글 등)',
  'SNS (인스타그램 등)',
  '지인 추천',
  '포트폴리오 사이트',
  '기타',
];

const LIKED_STORAGE_KEY = 'guestbook_liked_ids';

const getLikedIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const saveLikedIds = (ids) => {
  localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify([...ids]));
};

/* 사각형 SNS 버튼 — 아이콘 + 이름, 무채색 인버트 호버 */
const SnsButton = ({ icon, href, label }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2.2,
      py: 1.1,
      border: '1px solid var(--tm-border-2)',
      color: 'var(--tm-text-2)',
      textDecoration: 'none',
      fontSize: '0.82rem',
      fontWeight: 600,
      willChange: 'transform, background-color, color',
      transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
      '&:hover': {
        bgcolor: 'var(--tm-text-1)',
        color: 'var(--tm-bg-root)',
        borderColor: 'var(--tm-text-1)',
        transform: 'translateY(-3px)',
      },
    }}
  >
    {icon}
    {label}
  </Box>
);

const GuestbookEntry = ({ entry, liked, onLike }) => (
  <Box
    sx={{
      p: 2.5,
      border: '1px solid var(--tm-border-1)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{entry.emoji}</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tm-text-1)' }}>
        {entry.name}
      </Typography>
      {entry.organization && (
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--tm-text-3)' }}>
          · {entry.organization}
        </Typography>
      )}
      <Typography sx={{ fontSize: '0.75rem', color: 'var(--tm-text-3)', ml: 'auto' }}>
        {new Date(entry.created_at).toLocaleDateString('ko-KR')}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: '0.88rem', color: 'var(--tm-text-2)', lineHeight: 1.6, mb: 1 }}>
      {entry.message}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton
        onClick={() => onLike(entry.id)}
        disabled={liked}
        size="small"
        aria-label="좋아요"
        sx={{ color: liked ? 'var(--tm-text-1)' : 'var(--tm-text-3)' }}
      >
        {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
      <Typography sx={{ fontSize: '0.78rem', color: 'var(--tm-text-3)' }}>{entry.likes ?? 0}</Typography>
    </Box>
  </Box>
);

const ContactSection = () => {
  const [entries, setEntries] = useState([]);
  const [likedIds, setLikedIds] = useState(() => getLikedIds());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    referral: '',
    emoji: '👋',
    message: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    // 개인정보(email, phone)는 절대 함께 조회하지 않고 공개 항목만 select
    const { data } = await supabase
      .from('guestbook')
      .select('id, name, organization, emoji, message, likes, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    setEntries(data || []);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLike = async (entryId) => {
    if (likedIds.has(entryId)) return;
    const nextLiked = new Set(likedIds).add(entryId);
    setLikedIds(nextLiked);
    saveLikedIds(nextLiked);
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, likes: (e.likes ?? 0) + 1 } : e)));
    await supabase.rpc('increment_guestbook_like', { entry_id: entryId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);

    const { error } = await supabase.from('guestbook').insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      organization: form.organization.trim() || null,
      referral: form.referral || null,
      emoji: form.emoji,
      message: form.message.trim(),
    });

    if (error) {
      setToast({ open: true, message: '방명록 등록에 실패했습니다.', severity: 'error' });
    } else {
      setToast({ open: true, message: '방명록이 등록되었습니다!', severity: 'success' });
      setForm({ name: '', email: '', phone: '', organization: '', referral: '', emoji: '👋', message: '' });
      fetchEntries();
    }
    setLoading(false);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: 'var(--tm-text-1)',
      fontSize: '0.9rem',
      '& fieldset': { borderColor: 'var(--tm-border-2)' },
      '&:hover fieldset': { borderColor: 'var(--tm-text-2)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--tm-text-1)' },
    },
    '& .MuiInputLabel-root': { color: 'var(--tm-text-3)', fontSize: '0.85rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--tm-text-1)' },
  };

  const cardSx = {
    border: '1px solid var(--tm-border-1)',
    p: { xs: 3, sm: 4 },
  };

  const eyebrowSx = {
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    color: 'var(--tm-text-1)',
    mb: 3,
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 } }}>
      {/* GET IN TOUCH */}
      <Box sx={cardSx}>
        <Typography sx={eyebrowSx}>GET IN TOUCH</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              border: '1px solid var(--tm-border-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EmailIcon sx={{ color: 'var(--tm-text-2)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', color: 'var(--tm-text-3)', letterSpacing: '0.1em', mb: 0.3 }}>
              EMAIL
            </Typography>
            <Typography
              component="a"
              href="mailto:gyeongsik753@gmail.com"
              sx={{
                fontSize: '0.9rem',
                color: 'var(--tm-text-1)',
                textDecoration: 'none',
                '&:hover': { opacity: 0.6 },
              }}
            >
              gyeongsik753@gmail.com
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'var(--tm-border-1)', my: 3 }} />

        <Typography sx={{ ...eyebrowSx, color: 'var(--tm-text-3)', mb: 2 }}>SOCIAL</Typography>

        <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
          <SnsButton icon={<InstagramIcon fontSize="small" />} href="https://instagram.com" label="Instagram" />
          <SnsButton icon={<GitHubIcon fontSize="small" />} href="https://github.com/gyeongsik753-design" label="GitHub" />
          <SnsButton
            icon={<LanguageIcon fontSize="small" />}
            href="https://gyeongsik753-design.github.io/my-first-website/"
            label="Website"
          />
        </Box>
      </Box>

      {/* GUESTBOOK 작성 */}
      <Box sx={cardSx}>
        <Typography sx={eyebrowSx}>GUESTBOOK</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="이름" value={form.name} onChange={handleChange('name')} fullWidth size="small" required sx={inputSx} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="소속 / 직업" value={form.organization} onChange={handleChange('organization')} fullWidth size="small" sx={inputSx} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="이메일 (비공개)" value={form.email} onChange={handleChange('email')} fullWidth size="small" type="email" sx={inputSx} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="전화번호 (비공개)" value={form.phone} onChange={handleChange('phone')} fullWidth size="small" sx={inputSx} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="어떻게 알게 되셨나요?"
                value={form.referral}
                onChange={handleChange('referral')}
                fullWidth
                size="small"
                select
                sx={inputSx}
              >
                <MenuItem value="">선택 안함</MenuItem>
                {REFERRAL_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box>
            <Typography sx={{ fontSize: '0.78rem', color: 'var(--tm-text-3)', mb: 1 }}>이모지 선택</Typography>
            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
              {EMOJIS.map((emoji) => (
                <Chip
                  key={emoji}
                  label={emoji}
                  onClick={() => setForm((prev) => ({ ...prev, emoji }))}
                  sx={{
                    fontSize: '1.1rem',
                    height: 36,
                    borderRadius: 0,
                    bgcolor: form.emoji === emoji ? 'var(--tm-text-1)' : 'transparent',
                    border: '1px solid var(--tm-border-2)',
                    color: form.emoji === emoji ? 'var(--tm-bg-root)' : 'var(--tm-text-1)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Box>

          <TextField label="메시지" value={form.message} onChange={handleChange('message')} fullWidth multiline rows={3} required sx={inputSx} />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={<SendIcon />}
            sx={{
              bgcolor: 'var(--tm-text-1)',
              color: 'var(--tm-bg-root)',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              borderRadius: 0,
              py: 1.5,
              alignSelf: 'flex-end',
              px: 5,
              '&:hover': { bgcolor: 'var(--tm-text-1)', opacity: 0.8 },
              '&.Mui-disabled': { bgcolor: 'var(--tm-border-2)', color: 'var(--tm-text-3)' },
            }}
          >
            {loading ? '등록 중...' : '방명록 남기기'}
          </Button>
        </Box>
      </Box>

      {/* 방명록 목록 */}
      {entries.length > 0 && (
        <Box>
          <Typography sx={{ ...eyebrowSx, color: 'var(--tm-text-3)', mb: 2 }}>RECENT MESSAGES</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {entries.map((entry) => (
              <GuestbookEntry key={entry.id} entry={entry} liked={likedIds.has(entry.id)} onLike={handleLike} />
            ))}
          </Box>
        </Box>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ bgcolor: 'var(--tm-bg-root)', color: 'var(--tm-text-1)', border: '1px solid var(--tm-border-2)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
