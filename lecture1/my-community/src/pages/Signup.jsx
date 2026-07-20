import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(form);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message === 'User already registered' ? '이미 가입된 이메일입니다.' : signUpError.message);
      return;
    }

    setInfo('회원가입이 완료되었습니다. 로그인해주세요.');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: { xs: 4, sm: 10 }, px: 2 }}>
      <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h1" sx={{ fontSize: '1.75rem', textAlign: 'center', mb: 3 }}>
          WITF 회원가입
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

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="이름" value={form.name} onChange={handleChange('name')} required fullWidth />
          <TextField
            label="이메일"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            fullWidth
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
            autoComplete="new-password"
          />
          <TextField
            label="전화번호"
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={handleChange('phone')}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>
            {submitting ? '가입 중...' : '회원가입'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          이미 계정이 있으신가요?{' '}
          <Link component={RouterLink} to="/login" color="primary.main">
            로그인
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
