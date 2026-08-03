import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories';
import { BRANDS, BRAND_SLOTS } from '../lib/brands';
import CategoryTile from '../components/CategoryTile';

const BRAND_NAMES = BRANDS.map((b) => b.name);

export default function PostEdit() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [brandInputs, setBrandInputs] = useState(() =>
    Object.fromEntries(BRAND_SLOTS.map((slot) => [slot.key, '']))
  );
  const [brandPositions, setBrandPositions] = useState({});
  const [activeSlotKey, setActiveSlotKey] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [localFile, setLocalFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    supabase
      .from('posts')
      .select(
        `id, user_id, caption, category, image_url, brand_positions, ${BRAND_SLOTS.map((s) => s.key).join(', ')}`
      )
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (ignore) return;
        if (fetchError || !data || data.user_id !== user.id) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setCaption(data.caption ?? '');
        setCategory(data.category ?? DEFAULT_CATEGORY);
        setBrandInputs(Object.fromEntries(BRAND_SLOTS.map(({ key }) => [key, data[key] ?? ''])));
        setBrandPositions(data.brand_positions ?? {});
        setImageUrl(data.image_url ?? '');
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id, user.id]);

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

    setSubmitting(true);
    setError('');

    try {
      let nextImageUrl = imageUrl;

      if (localFile) {
        const path = `${user.id}/${Date.now()}-${localFile.name}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, localFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(path);
        nextImageUrl = publicUrlData.publicUrl;
      }

      const filledPositions = Object.fromEntries(
        BRAND_SLOTS.filter(({ key }) => brandInputs[key].trim() && brandPositions[key]).map(({ key }) => [
          key,
          brandPositions[key],
        ])
      );

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          caption: caption.trim(),
          category,
          ...Object.fromEntries(BRAND_SLOTS.map(({ key }) => [key, brandInputs[key].trim() || null])),
          brand_positions: filledPositions,
          image_url: nextImageUrl,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      navigate(`/posts/${id}`);
    } catch (err) {
      setError(`게시물 수정에 실패했습니다: ${err?.message ?? '알 수 없는 오류'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography color="text.secondary">수정할 수 있는 게시물이 아닙니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>게시물 수정</Typography>
          </Box>
          <Button variant="contained" color="secondary" size="small" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '저장 중...' : '저장'}
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

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>사진</Typography>
        <Box sx={{ width: '100%', maxWidth: 240, mb: 1.5 }}>
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
              src={localPreview || imageUrl}
              alt="게시물 사진"
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
        </Box>
        <Button variant="outlined" component="label" color="primary" startIcon={<UploadIcon />}>
          사진 교체
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Button>

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
                {hasName && (
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
