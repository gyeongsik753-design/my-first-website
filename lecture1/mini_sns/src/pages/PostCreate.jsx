import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { fetchRandomFashionPhotos } from '../lib/unsplash';

export default function PostCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPhotos = async () => {
    setLoadingPhotos(true);
    setError('');
    try {
      const result = await fetchRandomFashionPhotos(6);
      setPhotos(result);
    } catch {
      setError('Unsplash에서 이미지를 불러오지 못했습니다. VITE_UNSPLASH_ACCESS_KEY 설정을 확인해주세요.');
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 진입 시 이미지 자동 로드
    loadPhotos();
  }, []);

  const handleSubmit = async () => {
    if (!caption.trim()) {
      setError('캡션을 입력해주세요.');
      return;
    }
    if (!selected) {
      setError('이미지를 선택해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');
    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({ caption: caption.trim(), image_url: selected.url, user_id: user.id })
      .select('id')
      .single();
    setSubmitting(false);

    if (insertError) {
      setError('게시물 등록에 실패했습니다.');
      return;
    }
    navigate(`/posts/${data.id}`);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>새 게시물</Typography>
          </Box>
          <Button variant="contained" color="secondary" size="small" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '등록 중...' : '공유하기'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="캡션"
          placeholder="오늘의 코디를 소개해주세요"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>이미지 선택 (Unsplash)</Typography>
          <Button size="small" startIcon={<RefreshIcon />} onClick={loadPhotos} disabled={loadingPhotos}>
            새로고침
          </Button>
        </Box>

        {loadingPhotos ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Grid container spacing={1}>
            {photos.map((photo) => {
              const isSelected = selected?.id === photo.id;
              return (
                <Grid key={photo.id} size={4}>
                  <Box
                    onClick={() => setSelected(photo)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      borderRadius: 1,
                      border: isSelected ? '3px solid' : '1px solid',
                      borderColor: isSelected ? 'secondary.main' : 'divider',
                    }}
                  >
                    <Box component="img" src={photo.thumb} alt={photo.alt} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isSelected && (
                      <CheckCircleIcon
                        sx={{ position: 'absolute', top: 4, right: 4, color: 'secondary.main', bgcolor: '#fff', borderRadius: '50%' }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
