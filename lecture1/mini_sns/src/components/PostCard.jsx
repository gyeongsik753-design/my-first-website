import { Box, Typography, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post }) {
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2, mb: 2 }}>
      <Box
        component={RouterLink}
        to={`/posts/${post.id}`}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 2, py: 1, textDecoration: 'none', color: 'inherit' }}
      >
        <Avatar src={post.users?.avatar_url || undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
          {post.users?.username?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>@{post.users?.username ?? 'unknown'}</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', ml: 'auto' }}>
          {formatDate(post.created_at)}
        </Typography>
      </Box>

      <Box component={RouterLink} to={`/posts/${post.id}`} sx={{ display: 'block' }}>
        <Box
          component="img"
          src={post.image_url}
          alt={post.caption}
          sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', bgcolor: '#f0f0f0' }}
        />
      </Box>

      <Box sx={{ px: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
          <FavoriteIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{post.likes_count ?? 0}</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.85rem' }}>
          <Box component="span" sx={{ fontWeight: 700, mr: 0.7 }}>
            @{post.users?.username ?? 'unknown'}
          </Box>
          {post.caption}
        </Typography>
      </Box>
    </Box>
  );
}
