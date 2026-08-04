import { useState } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getLikedIds, saveLikedIds } from '../lib/likes';
import { BRAND_SLOTS } from '../lib/brands';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(() => getLikedIds().has(post.id));
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [burst, setBurst] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const like = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (liked) return;
    const ids = getLikedIds().add(post.id);
    saveLikedIds(ids);
    setLiked(true);
    setLikesCount((c) => c + 1);
    supabase.rpc('increment_post_likes', { post_id_input: post.id });
  };

  const handleDoubleClick = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    like();
  };

  const handleLikeButton = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (liked) {
      const ids = getLikedIds();
      ids.delete(post.id);
      saveLikedIds(ids);
      setLiked(false);
      setLikesCount((c) => Math.max(c - 1, 0));
      supabase.rpc('decrement_post_likes', { post_id_input: post.id });
    } else {
      like();
    }
  };

  const handleToggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      setLoadingComments(true);
      const { data } = await supabase
        .from('comments')
        .select('id, content, users ( username )')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      setComments(data ?? []);
      setCommentsLoaded(true);
      setLoadingComments(false);
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
      .insert({ content: commentText.trim(), post_id: post.id, author_id: user.id })
      .select('id, content, users ( username )')
      .single();
    setPosting(false);

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setCommentsLoaded(true);
      setCommentText('');
    }
  };

  const displayedCommentsCount = commentsLoaded ? comments.length : post.comments_count ?? 0;
  const pinnedBrands = BRAND_SLOTS.filter(({ key }) => post[key] && post.brand_positions?.[key]);
  const looseBrands = BRAND_SLOTS.filter(({ key }) => post[key] && !post.brand_positions?.[key]);

  return (
    <Box
      sx={{
        mx: 2,
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.75, py: 1.25 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'conic-gradient(from 220deg, #E1263F, #111111, #E1263F)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Avatar
            src={post.users?.avatar_url || undefined}
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, border: '2px solid', borderColor: 'background.default' }}
          >
            {post.users?.username?.[0]?.toUpperCase() ?? '?'}
          </Avatar>
        </Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.01em' }}>
          @{post.users?.username ?? 'unknown'}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', ml: 'auto', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {formatDate(post.created_at)}
        </Typography>
      </Box>

      <Box
        sx={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => setShowBrands((v) => !v)}
        onDoubleClick={handleDoubleClick}
      >
        <Box
          component="img"
          src={post.image_url}
          alt={post.caption}
          sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', bgcolor: 'background.paper', display: 'block' }}
        />
        {showBrands &&
          pinnedBrands.map(({ key }) => {
            const { x, y } = post.brand_positions[key];
            return (
              <Box
                key={key}
                sx={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  whiteSpace: 'nowrap',
                  bgcolor: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 4,
                  px: 1,
                  py: 0.4,
                }}
              >
                {post[key]}
              </Box>
            );
          })}
        {burst && (
          <FavoriteIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontSize: 96,
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

      <Box sx={{ px: 1.75, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={handleLikeButton}
              size="small"
              disableRipple
              sx={{
                p: 0,
                color: liked ? 'secondary.main' : 'text.secondary',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:active': { transform: 'scale(1.35)' },
              }}
            >
              {liked ? <FavoriteIcon sx={{ fontSize: 22 }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
            </IconButton>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 800 }}>{likesCount}</Typography>
          </Box>
          <Box
            onClick={handleToggleComments}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', cursor: 'pointer' }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 19 }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: 'text.primary' }}>
              {displayedCommentsCount}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.87rem', lineHeight: 1.5 }}>
          <Box component="span" sx={{ fontWeight: 800, mr: 0.7 }}>
            @{post.users?.username ?? 'unknown'}
          </Box>
          {post.caption}
        </Typography>

        {showBrands && looseBrands.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1 }}>
            {looseBrands.map(({ key }) => (
              <Box
                key={key}
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'secondary.main',
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  borderRadius: 4,
                  px: 1,
                  py: 0.25,
                }}
              >
                {post[key]}
              </Box>
            ))}
          </Box>
        )}

        {showComments && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            {loadingComments ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={18} color="secondary" />
              </Box>
            ) : (
              <>
                {comments.length === 0 ? (
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>
                    첫 댓글을 남겨보세요.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.25 }}>
                    {comments.map((c) => (
                      <Typography key={c.id} sx={{ fontSize: '0.83rem' }}>
                        <Box component="span" sx={{ fontWeight: 800, mr: 0.6 }}>
                          @{c.users?.username ?? '알 수 없음'}
                        </Box>
                        {c.content}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!user}
                  />
                  <Button type="submit" variant="contained" color="secondary" size="small" disabled={posting || !user}>
                    등록
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
