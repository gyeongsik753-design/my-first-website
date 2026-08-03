import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, TextField, Button, Alert, Stack, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories';
import { BRANDS, BRAND_SLOTS } from '../lib/brands';
import CategoryTile from '../components/CategoryTile';

const BRAND_NAMES = BRANDS.map((b) => b.name);

export default function PostCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [brandInputs, setBrandInputs] = useState(() =>
    Object.fromEntries(BRAND_SLOTS.map((slot) => [slot.key, '']))
  );
  const [brandPositions, setBrandPositions] = useState({});
  const [activeSlotKey, setActiveSlotKey] = useState(null);
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
    setBrandPositions({});
    setActiveSlotKey(null);
  };

  const handleImageClick = (e) => {
    if (!activeSlotKey) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBrandPositions((prev) => ({ ...prev, [activeSlotKey]: { x, y } }));
    setActiveSlotKey(null);
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

      const filledPositions = Object.fromEntries(
        BRAND_SLOTS.filter(({ key }) => brandInputs[key].trim() && brandPositions[key]).map(({ key }) => [
          key,
          brandPositions[key],
        ])
      );

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({
          caption: caption.trim(),
          image_url: publicUrlData.publicUrl,
          category,
          ...Object.fromEntries(BRAND_SLOTS.map(({ key }) => [key, brandInputs[key].trim() || null])),
          brand_positions: filledPositions,
          user_id: user.id,
        })
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

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>카테고리</Typography>
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.value}
              icon={c.icon}
              label={c.label}
              gradient={c.gradient}
              selected={category === c.value}
              onClick={() => setCategory(c.value)}
            />
          ))}
        </Stack>

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>사진 업로드</Typography>

        {localPreview ? (
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 240 }}>
            <Box
              onClick={handleImageClick}
              sx={{
                position: 'relative',
                cursor: activeSlotKey ? 'crosshair' : 'default',
                borderRadius: 1,
                overflow: 'hidden',
                border: '3px solid',
                borderColor: 'secondary.main',
              }}
            >
              <Box
                component="img"
                src={localPreview}
                alt="업로드할 사진 미리보기"
                sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }}
              />
              {BRAND_SLOTS.filter(({ key }) => brandInputs[key].trim() && brandPositions[key]).map(({ key }) => (
                <Box
                  key={key}
                  sx={{
                    position: 'absolute',
                    left: `${brandPositions[key].x}%`,
                    top: `${brandPositions[key].y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
            </Box>
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

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mt: 3, mb: 1.5 }}>브랜드</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {BRAND_SLOTS.map(({ key, label }) => {
            const hasName = brandInputs[key].trim().length > 0;
            const hasPosition = Boolean(brandPositions[key]);
            return (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Autocomplete
                  freeSolo
                  options={BRAND_NAMES}
                  value={brandInputs[key]}
                  onChange={(_e, newValue) => setBrandInputs((prev) => ({ ...prev, [key]: newValue ?? '' }))}
                  onInputChange={(_e, newInputValue) =>
                    setBrandInputs((prev) => ({ ...prev, [key]: newInputValue }))
                  }
                  renderInput={(params) => <TextField {...params} label={label} size="small" placeholder="브랜드 입력" />}
                  sx={{ flex: 1 }}
                />
                {localPreview && hasName && (
                  <Button
                    size="small"
                    variant={activeSlotKey === key ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => setActiveSlotKey(key)}
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {activeSlotKey === key ? '사진을 클릭하세요' : hasPosition ? '위치 재지정' : '위치 지정'}
                  </Button>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
