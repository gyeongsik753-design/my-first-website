import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Stack,
  AppBar,
  Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import TopBarActions from '../components/TopBarActions';
import { getLikedIds, saveLikedIds } from '../lib/likes';

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(() => getLikedIds().has(Number(id)));
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [burst, setBurst] = useState(false);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: postData }, { data: commentData }] = await Promise.all([
        supabase.from('posts').select('*, users ( username, display_name, avatar_url )').eq('id', id).single(),
        supabase
          .from('comments')
          .select('*, users ( username )')
          .eq('post_id', id)
          .order('created_at', { ascending: true }),
      ]);
      setPost(postData ?? null);
      setComments(commentData ?? []);
    } catch {
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 게시물 id 변경 시 재조회
    loadPost();
  }, [loadPost]);

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const nextLiked = getLikedIds();
    if (liked) {
      nextLiked.delete(Number(id));
      setLiked(false);
      setPost((p) => ({ ...p, likes_count: Math.max((p.likes_count ?? 1) - 1, 0) }));
      await supabase.rpc('decrement_post_likes', { post_id_input: Number(id) });
    } else {
      nextLiked.add(Number(id));
      setLiked(true);
      setPost((p) => ({ ...p, likes_count: (p.likes_count ?? 0) + 1 }));
      await supabase.rpc('increment_post_likes', { post_id_input: Number(id) });
    }
    saveLikedIds(nextLiked);
  };

  const handleDoubleClickImage = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    if (!liked) handleToggleLike();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setPosting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({ content: commentText.trim(), post_id: id, author_id: user.id })
      .select('*, users ( username )')
      .single();
    setPosting(false);

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setCommentText('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box>
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton edge="start" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </IconButton>
            <TopBarActions />
          </Toolbar>
        </AppBar>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography color="text.secondary">게시물을 찾을 수 없습니다.</Typography>
        </Box>
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
            <Typography sx={{ fontWeight: 700 }}>게시물</Typography>
          </Box>
          <TopBarActions />
        </Toolbar>
      </AppBar>

      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ px: 2, py: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'conic-gradient(from 220deg, #E1263F, #111111, #E1263F)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Avatar src={post.users?.avatar_url || undefined} sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: '2px solid #fff' }}>
            {post.users?.username?.[0]?.toUpperCase() ?? '?'}
          </Avatar>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.01em' }}>@{post.users?.username}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {formatDateTime(post.created_at)}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ position: 'relative', mx: 2, borderRadius: 3, overflow: 'hidden' }} onDoubleClick={handleDoubleClickImage}>
        <Box component="img" src={post.image_url} alt={post.caption} sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', bgcolor: '#f0f0f0', display: 'block' }} />
        {burst && (
          <FavoriteIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontSize: 110,
              color: '#fff',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))',
              pointerEvents: 'none',
              animation: 'heartBurst 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.49)',
              '@keyframes heartBurst': {
                '0%': { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
                '30%': { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
                '60%': { transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 },
                '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
              },
            }}
          />
        )}
      </Box>

      <Box sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <IconButton
            onClick={handleToggleLike}
            size="small"
            disableRipple
            sx={{
              pl: 0,
              color: liked ? 'secondary.main' : 'text.secondary',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:active': { transform: 'scale(1.35)' },
            }}
          >
            {liked ? <FavoriteIcon sx={{ fontSize: 26 }} /> : <FavoriteBorderIcon sx={{ fontSize: 26 }} />}
          </IconButton>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>좋아요 {post.likes_count ?? 0}개</Typography>
        </Stack>
        <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          <Box component="span" sx={{ fontWeight: 800, mr: 0.7 }}>
            @{post.users?.username}
          </Box>
          {post.caption}
        </Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          댓글 {comments.length}개
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {comments.map((c) => (
            <Box key={c.id} sx={{ p: 1.25, borderRadius: 2, bgcolor: '#f7f7f7' }}>
              <Typography sx={{ fontSize: '0.85rem' }}>
                <Box component="span" sx={{ fontWeight: 800, mr: 0.7 }}>
                  @{c.users?.username ?? '알 수 없음'}
                </Box>
                {c.content}
              </Typography>
            </Box>
          ))}
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              첫 댓글을 남겨보세요.
            </Typography>
          )}
        </Stack>
      </Box>

      <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, px: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!user}
        />
        <Button type="submit" variant="contained" color="secondary" disabled={posting || !user}>
          등록
        </Button>
      </Box>
    </Box>
  );
}
