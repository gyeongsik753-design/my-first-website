import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import TopBarActions from '../components/TopBarActions';

export default function MyPage() {
  const { user, profile, profileLoading, profileError, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 사용자 변경 시 로딩 상태로 재진입
    setLoading(true);
    supabase
      .from('posts')
      .select('id, image_url, likes_count')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const startEditBio = () => {
    setBioDraft(profile?.bio ?? '');
    setAvatarFile(null);
    setAvatarPreview('');
    setSaveError('');
    setEditingBio(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const saveBio = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const updates = { bio: bioDraft.trim() };

      if (avatarFile) {
        const path = `avatars/${user.id}/${Date.now()}-${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, avatarFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(path);
        updates.avatar_url = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase.from('users').update(updates).eq('id', user.id);
      if (updateError) throw updateError;

      await refreshProfile();
      setEditingBio(false);
    } catch (err) {
      setSaveError(err?.message ?? '프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // 프로필 행이 없는 경우 (DB에 users 테이블/가입 트리거가 아직 설정되지 않았거나 조회 실패)
  if (!profile) {
    return (
      <Box>
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>마이페이지 · 설정</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TopBarActions showProfile={false} />
              <IconButton onClick={handleLogout} aria-label="로그아웃" color="inherit">
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
            프로필 정보를 불러오지 못했습니다.
            {profileError && (
              <Typography variant="caption" component="div" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                {profileError}
              </Typography>
            )}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Supabase 프로젝트에 users 테이블/회원가입 트리거가 설정되지 않았을 수 있습니다.
            (supabase/schema.sql 실행 여부를 확인해주세요)
          </Typography>
          <Button variant="outlined" onClick={refreshProfile}>
            다시 시도
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700 }}>마이페이지 · 설정</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TopBarActions />
            <IconButton onClick={handleLogout} aria-label="로그아웃" color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2.5, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', width: 84, mx: 'auto', mb: 1.5 }}>
          <Avatar
            src={avatarPreview || profile.avatar_url || undefined}
            sx={{ width: 84, height: 84, bgcolor: 'primary.main', fontSize: 28 }}
          >
            {profile.username?.[0]?.toUpperCase() ?? '?'}
          </Avatar>
          {editingBio && (
            <IconButton
              component="label"
              size="small"
              aria-label="프로필 사진 변경"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'secondary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'secondary.main', opacity: 0.9 },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </IconButton>
          )}
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile.display_name}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5 }}>@{profile.username}</Typography>

        {editingBio ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {saveError && (
              <Alert severity="error" sx={{ width: '100%', maxWidth: 320, textAlign: 'left' }}>
                {saveError}
              </Alert>
            )}
            <TextField
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              placeholder="자기소개를 입력해주세요"
              size="small"
              fullWidth
              multiline
              sx={{ maxWidth: 320 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setEditingBio(false);
                  setAvatarFile(null);
                  setAvatarPreview('');
                }}
              >
                취소
              </Button>
              <Button size="small" variant="contained" color="secondary" onClick={saveBio} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ fontSize: '0.85rem', color: profile.bio ? 'text.primary' : 'text.secondary', mb: 1 }}>
              {profile.bio || '소개글이 없습니다.'}
            </Typography>
            <Button size="small" variant="outlined" onClick={startEditBio} sx={{ borderRadius: 4 }}>
              프로필 편집
            </Button>
          </Box>
        )}
      </Box>

      <Typography sx={{ px: 2, fontWeight: 700, fontSize: '0.85rem', color: 'text.secondary', mb: 1 }}>
        내 게시물 {posts.length}개
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
          아직 올린 게시물이 없습니다.
        </Typography>
      ) : (
        <Grid container spacing={0.3} sx={{ px: 0.3 }}>
          {posts.map((post) => (
            <Grid key={post.id} size={4}>
              <Box
                component={RouterLink}
                to={`/posts/${post.id}`}
                sx={{ display: 'block', aspectRatio: '1 / 1', overflow: 'hidden' }}
              >
                <Box component="img" src={post.image_url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
