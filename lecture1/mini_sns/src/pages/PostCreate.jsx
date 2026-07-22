import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, TextField, Button, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { fetchRandomFashionPhotos } from '../lib/unsplash';

export default function PostCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');
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

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleSelectUnsplash = (photo) => {
    setSelected(photo);
    setLocalFile(null);
    setLocalPreview('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
    setLocalPreview(URL.createObjectURL(file));
    setSelected(null);
  };

  const handleRemoveLocalFile = () => {
    setLocalFile(null);
    setLocalPreview('');
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      setError('캡션을 입력해주세요.');
      return;
    }
    if (!selected && !localFile) {
      setError('이미지를 선택하거나 업로드해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let imageUrl = selected?.url;

      if (localFile) {
        const path = `${user.id}/${Date.now()}-${localFile.name}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, localFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({ caption: caption.trim(), image_url: imageUrl, user_id: user.id })
        .select('id')
        .single();

      if (insertError) throw insertError;

      navigate(`/posts/${data.id}`);
    } catch {
      setError('게시물 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
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

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>내 사진 업로드</Typography>

        {localPreview ? (
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 240, mb: 1 }}>
            <Box
              component="img"
              src={localPreview}
              alt="업로드할 사진 미리보기"
              sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 1, border: '3px solid', borderColor: 'secondary.main' }}
            />
            <IconButton
              onClick={handleRemoveLocalFile}
              size="small"
              aria-label="선택한 사진 제거"
              sx={{ position: 'absolute', top: 4, right: 4, bgcolor: '#fff', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button variant="outlined" component="label" color="primary" startIcon={<UploadIcon />} sx={{ mb: 1 }}>
            사진 선택
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        )}

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            또는
          </Typography>
        </Divider>

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
                    onClick={() => handleSelectUnsplash(photo)}
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
