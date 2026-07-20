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
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import TopBarActions from '../components/TopBarActions';

export default function MyPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [saving, setSaving] = useState(false);

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
    setEditingBio(true);
  };

  const saveBio = async () => {
    setSaving(true);
    await supabase.from('users').update({ bio: bioDraft.trim() }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setEditingBio(false);
  };

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 9 }}>
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
        <Avatar src={profile.avatar_url || undefined} sx={{ width: 84, height: 84, mx: 'auto', mb: 1.5, bgcolor: 'primary.main', fontSize: 28 }}>
          {profile.username?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile.display_name}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5 }}>@{profile.username}</Typography>

        {editingBio ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
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
              <Button size="small" onClick={() => setEditingBio(false)}>
                취소
              </Button>
              <Button size="small" variant="contained" color="secondary" onClick={saveBio} disabled={saving}>
                저장
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
