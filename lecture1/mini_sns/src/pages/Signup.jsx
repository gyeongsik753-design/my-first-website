import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!form.username.trim()) {
      setError('사용자명을 입력해주세요.');
      return;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp({
      email: form.email,
      password: form.password,
      username: form.username.trim(),
      displayName: form.username.trim(),
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message === 'User already registered' ? '이미 가입된 이메일입니다.' : signUpError.message);
      return;
    }

    setInfo('회원가입이 완료되었습니다. 로그인해주세요.');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <Typography
          sx={{ textAlign: 'center', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '0.02em', mb: 3 }}
        >
          WITF
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {info}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            label="사용자명"
            value={form.username}
            onChange={handleChange('username')}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="이메일"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            fullWidth
            size="small"
            autoComplete="email"
          />
          <TextField
            label="비밀번호"
            type="password"
            helperText="6자 이상 입력해주세요"
            value={form.password}
            onChange={handleChange('password')}
            required
            fullWidth
            size="small"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            sx={{ borderRadius: 1.5, py: 1.2, mt: 1 }}
          >
            {submitting ? '가입 중...' : '회원가입'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          이미 계정이 있으신가요?{' '}
          <Link component={RouterLink} to="/login" color="secondary.main" sx={{ fontWeight: 700 }}>
            로그인
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
