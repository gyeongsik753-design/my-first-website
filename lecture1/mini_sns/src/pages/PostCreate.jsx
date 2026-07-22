import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, TextField, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function PostCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
    setLocalPreview(URL.createObjectURL(file));
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
    if (!localFile) {
      setError('사진을 선택해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const path = `${user.id}/${Date.now()}-${localFile.name}`;
      const { error: uploadError } = await supabase.storage.from('post-images').upload(path, localFile);
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(path);

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({ caption: caption.trim(), image_url: publicUrlData.publicUrl, user_id: user.id })
        .select('id')
        .single();

      if (insertError) throw insertError;

      navigate(`/posts/${data.id}`);
    } catch (err) {
      setError(`게시물 등록에 실패했습니다: ${err?.message ?? '알 수 없는 오류'}`);
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

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>사진 업로드</Typography>

        {localPreview ? (
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 240 }}>
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
          <Button variant="outlined" component="label" color="primary" startIcon={<UploadIcon />}>
            사진 선택
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        )}
      </Box>
    </Box>
  );
}
