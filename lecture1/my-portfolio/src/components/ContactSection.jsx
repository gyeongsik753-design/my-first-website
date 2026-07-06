import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
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
import { supabase } from '../lib/supabase';

const EMOJIS = ['👋', '🔥', '🖤', '✨', '💫', '🤙', '👑', '💀'];

const REFERRAL_OPTIONS = [
  '검색 (구글 등)',
  'SNS (인스타그램 등)',
  '지인 추천',
  '포트폴리오 사이트',
  '기타',
];

const SnsButton = ({ icon, href, label }) => (
  <IconButton
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    sx={{
      width: 48, height: 48,
      border: '1px solid #333333',
      color: '#AAAAAA',
      borderRadius: 0,
      willChange: 'transform, box-shadow',
      transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
      '&:hover': {
        borderColor: '#C8102E',
        color: '#FFFFFF',
        bgcolor: 'rgba(200,16,46,0.1)',
        transform: 'translateY(-6px) scale(1.1)',
        boxShadow: '0 10px 22px rgba(200,16,46,0.28)',
      },
      '&:active': { transform: 'translateY(-2px) scale(1.05)' },
    }}
  >
    {icon}
  </IconButton>
);

const GuestbookEntry = ({ entry }) => (
  <Box
    sx={{
      p: 2.5,
      bgcolor: '#0A0A0A',
      border: '1px solid #1A1A1A',
      borderRadius: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>
        {entry.emoji}
      </Typography>
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>
        {entry.name}
      </Typography>
      {entry.organization && (
        <Typography sx={{ fontSize: '0.78rem', color: '#555555' }}>
          · {entry.organization}
        </Typography>
      )}
      <Typography sx={{ fontSize: '0.75rem', color: '#444444', ml: 'auto' }}>
        {new Date(entry.created_at).toLocaleDateString('ko-KR')}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: '0.88rem', color: '#BBBBBB', lineHeight: 1.6 }}>
      {entry.message}
    </Typography>
  </Box>
);

const ContactSection = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    referral: '',
    emoji: '👋',
    message: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setEntries(data || []);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);

    const { error } = await supabase.from('guestbook').insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      organization: form.organization.trim() || null,
      referral: form.referral || null,
      emoji: form.emoji,
      message: form.message.trim(),
    });

    if (error) {
      setToast({ open: true, message: '방명록 등록에 실패했습니다.', severity: 'error' });
    } else {
      setToast({ open: true, message: '방명록이 등록되었습니다!', severity: 'success' });
      setForm({ name: '', email: '', organization: '', referral: '', emoji: '👋', message: '' });
      fetchEntries();
    }
    setLoading(false);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#0A0A0A',
      color: '#FFFFFF',
      fontSize: '0.9rem',
      '& fieldset': { borderColor: '#222222' },
      '&:hover fieldset': { borderColor: '#444444' },
      '&.Mui-focused fieldset': { borderColor: '#C8102E' },
    },
    '& .MuiInputLabel-root': { color: '#555555', fontSize: '0.85rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#C8102E' },
  };

  return (
    <Box>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        {/* 왼쪽: 연락처 정보 */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              bgcolor: '#0A0A0A',
              border: '1px solid #1A1A1A',
              borderRadius: 2,
              p: 4,
              boxShadow: 'none',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: '#C8102E',
                mb: 3,
              }}
            >
              GET IN TOUCH
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid #222222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmailIcon sx={{ color: '#AAAAAA', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#555555', letterSpacing: '0.1em', mb: 0.3 }}>
                  EMAIL
                </Typography>
                <Typography
                  component="a"
                  href="mailto:gyeongsik753@gmail.com"
                  sx={{
                    fontSize: '0.9rem',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    '&:hover': { color: '#C8102E' },
                  }}
                >
                  gyeongsik753@gmail.com
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#1A1A1A', my: 3 }} />

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: '#666666',
                mb: 2,
              }}
            >
              SOCIAL
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <SnsButton icon={<InstagramIcon />} href="https://instagram.com" label="Instagram" />
              <SnsButton icon={<GitHubIcon />} href="https://github.com/gyeongsik753-design" label="GitHub" />
              <SnsButton icon={<LanguageIcon />} href="https://gyeongsik753-design.github.io/my-first-website/" label="Website" />
            </Box>
          </Card>
        </Grid>

        {/* 오른쪽: 방명록 폼 */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              bgcolor: '#0A0A0A',
              border: '1px solid #1A1A1A',
              borderRadius: 2,
              p: 4,
              boxShadow: 'none',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: '#C8102E',
                mb: 3,
              }}
            >
              GUESTBOOK
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="이름 *"
                    value={form.name}
                    onChange={handleChange('name')}
                    fullWidth
                    size="small"
                    required
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="이메일 (비공개)"
                    value={form.email}
                    onChange={handleChange('email')}
                    fullWidth
                    size="small"
                    type="email"
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="소속 / 직업"
                    value={form.organization}
                    onChange={handleChange('organization')}
                    fullWidth
                    size="small"
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Box>
                <Typography sx={{ fontSize: '0.78rem', color: '#555555', mb: 1 }}>이모지 선택</Typography>
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                  {EMOJIS.map((emoji) => (
                    <Chip
                      key={emoji}
                      label={emoji}
                      onClick={() => setForm((prev) => ({ ...prev, emoji }))}
                      sx={{
                        fontSize: '1.1rem',
                        height: 36,
                        bgcolor: form.emoji === emoji ? '#1A1A1A' : 'transparent',
                        border: form.emoji === emoji ? '1px solid #C8102E' : '1px solid #222222',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#1A1A1A' },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                label="메시지 *"
                value={form.message}
                onChange={handleChange('message')}
                fullWidth
                multiline
                rows={3}
                required
                sx={inputSx}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  borderRadius: 0,
                  py: 1.5,
                  alignSelf: 'flex-end',
                  px: 5,
                  '&:hover': { bgcolor: '#C8102E', color: '#FFFFFF' },
                  '&.Mui-disabled': { bgcolor: '#333333', color: '#666666' },
                }}
              >
                {loading ? '등록 중...' : '방명록 남기기'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 방명록 목록 */}
      {entries.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#666666',
              mb: 2,
            }}
          >
            RECENT MESSAGES
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {entries.map((entry) => (
              <GuestbookEntry key={entry.id} entry={entry} />
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
          sx={{ bgcolor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333333' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
