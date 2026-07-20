import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Link } from '@mui/material';
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
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: { xs: 4, sm: 10 }, px: 2 }}>
      <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h1" sx={{ fontSize: '1.75rem', textAlign: 'center', mb: 3 }}>
          WITF 로그인
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>
            {submitting ? '로그인 중...' : '로그인'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          계정이 없으신가요?{' '}
          <Link component={RouterLink} to="/signup" color="primary.main">
            회원가입
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
