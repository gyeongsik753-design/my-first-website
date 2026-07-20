import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function PostCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;

      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(path);
        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({ title: title.trim(), content: content.trim(), image_url: imageUrl, author_id: user.id })
        .select('id')
        .single();

      if (insertError) throw insertError;

      navigate(`/posts/${data.id}`);
    } catch (err) {
      setError(err.message ?? '게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 4 }}>
      <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h1" sx={{ fontSize: '1.5rem', mb: 3 }}>
          새 스타일 공유하기
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="제목" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            fullWidth
            multiline
            minRows={5}
          />

          <Button variant="outlined" component="label" color="primary">
            사진 선택
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>

          {preview && (
            <Box component="img" src={preview} alt="미리보기" sx={{ width: '100%', borderRadius: 2, maxHeight: 320, objectFit: 'cover' }} />
          )}

          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting}>
            {submitting ? '등록 중...' : '게시하기'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
