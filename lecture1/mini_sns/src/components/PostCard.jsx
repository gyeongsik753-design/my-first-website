import { useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getLikedIds, saveLikedIds } from '../lib/likes';

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
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 24px rgba(17,17,17,0.1)',
        },
      }}
    >
      <Box
        component={RouterLink}
        to={`/posts/${post.id}`}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.75, py: 1.25, textDecoration: 'none', color: 'inherit' }}
      >
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
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, border: '2px solid #fff' }}
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

      <Box sx={{ position: 'relative' }} onDoubleClick={handleDoubleClick}>
        <Box
          component={RouterLink}
          to={`/posts/${post.id}`}
          sx={{ display: 'block' }}
          onClick={(e) => {
            // 더블클릭의 첫 클릭이 즉시 라우팅되지 않도록 살짝 지연 처리
            if (e.detail > 1) e.preventDefault();
          }}
        >
          <Box
            component="img"
            src={post.image_url}
            alt={post.caption}
            sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', bgcolor: '#f0f0f0', display: 'block' }}
          />
        </Box>
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
            component={RouterLink}
            to={`/posts/${post.id}`}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', textDecoration: 'none' }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 19 }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.87rem', lineHeight: 1.5 }}>
          <Box component="span" sx={{ fontWeight: 800, mr: 0.7 }}>
            @{post.users?.username ?? 'unknown'}
          </Box>
          {post.caption}
        </Typography>
      </Box>
    </Box>
  );
}
