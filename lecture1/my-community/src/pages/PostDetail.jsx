import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

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
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadPost = useCallback(async () => {
    setLoading(true);

    const [{ data: postData }, { data: commentData }, { count: likeTotal }] = await Promise.all([
      supabase.from('posts').select('*, users ( name )').eq('id', id).single(),
      supabase
        .from('comments')
        .select('*, users ( name )')
        .eq('post_id', id)
        .order('created_at', { ascending: true }),
      supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', id),
    ]);

    setPost(postData ?? null);
    setComments(commentData ?? []);
    setLikeCount(likeTotal ?? 0);

    if (user) {
      const { data: myLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      setLiked(!!myLike);
    }

    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 게시물 id 변경 시 재조회
    loadPost();
    supabase.rpc('increment_post_view', { post_id_input: Number(id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from('likes').insert({ post_id: id, user_id: user.id });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
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
      .select('*, users ( name )')
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
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography color="text.secondary">게시물을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 4 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>{post.users?.name?.[0]?.toUpperCase() ?? '?'}</Avatar>
        <Box>
          <Typography fontWeight={700}>{post.users?.name ?? '알 수 없음'}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(post.created_at)}
          </Typography>
        </Box>
      </Stack>

      {post.image_url && (
        <Box
          component="img"
          src={post.image_url}
          alt={post.title}
          sx={{ width: '100%', borderRadius: 2, mb: 2, maxHeight: 560, objectFit: 'cover' }}
        />
      )}

      <Typography variant="h1" sx={{ fontSize: '1.5rem', mb: 1 }}>
        {post.title}
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>{post.content}</Typography>

      <Stack direction="row" spacing={3} alignItems="center" color="text.secondary" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton onClick={handleToggleLike} size="small" color={liked ? 'secondary' : 'default'}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{likeCount}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="body2">{comments.length}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <VisibilityOutlinedIcon fontSize="small" />
          <Typography variant="body2">{post.view_count}</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h2" sx={{ fontSize: '1.1rem', mb: 2 }}>
        댓글 {comments.length}
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {comments.map((c) => (
          <Box key={c.id}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {c.users?.name ?? '알 수 없음'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(c.created_at)}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
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

      <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!user}
        />
        <Button type="submit" variant="contained" color="primary" disabled={posting || !user}>
          등록
        </Button>
      </Box>
    </Box>
  );
}
