import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn({ email, password });
    setSubmitting(false);

    if (signInError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    const redirectTo = location.state?.from?.pathname ?? '/';
    navigate(redirectTo, { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 900,
            fontSize: '2.2rem',
            letterSpacing: '0.02em',
            mb: 0.5,
            fontFamily: '"Roboto", cursive',
          }}
        >
          WITF
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 4, fontSize: '0.85rem' }}>
          What Is Today's Fashion? — 오늘의 OOTD를 공유해보세요
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
            autoComplete="email"
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            sx={{ borderRadius: 1.5, py: 1.2, mt: 1 }}
          >
            {submitting ? '로그인 중...' : '로그인'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          계정이 없으신가요?{' '}
          <Link component={RouterLink} to="/signup" color="secondary.main" sx={{ fontWeight: 700 }}>
            회원가입
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
