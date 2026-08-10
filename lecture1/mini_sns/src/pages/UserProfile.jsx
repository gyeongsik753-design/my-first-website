import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Grid, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setNotFound(false);

    supabase
      .from('users')
      .select('id, username, display_name, avatar_url, bio')
      .eq('username', username)
      .single()
      .then(async ({ data, error }) => {
        if (ignore) return;
        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProfile(data);
        const { data: postData } = await supabase
          .from('posts')
          .select('id, image_url')
          .eq('user_id', data.id)
          .order('created_at', { ascending: false });
        if (!ignore) {
          setPosts(postData ?? []);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography color="text.secondary">사용자를 찾을 수 없습니다.</Typography>
        </Box>
      </Box>
    );
  }

  const isMe = user?.id === profile.id;

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 700 }}>@{profile.username}</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2.5, textAlign: 'center' }}>
        <Avatar
          src={profile.avatar_url || undefined}
          sx={{ width: 84, height: 84, bgcolor: 'primary.main', fontSize: 28, mx: 'auto', mb: 1.5 }}
        >
          {profile.username?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile.display_name}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5 }}>@{profile.username}</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: profile.bio ? 'text.primary' : 'text.secondary', mb: 1.5 }}>
          {profile.bio || '소개글이 없습니다.'}
        </Typography>
        {isMe && (
          <Button component={RouterLink} to="/mypage" size="small" variant="outlined" sx={{ borderRadius: 4 }}>
            프로필 편집
          </Button>
        )}
      </Box>

      <Typography sx={{ px: 2, fontWeight: 700, fontSize: '0.85rem', color: 'text.secondary', mb: 1 }}>
        게시물 {posts.length}개
      </Typography>

      {posts.length === 0 ? (
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
