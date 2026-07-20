import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export default function PostCard({ post }) {
  return (
    <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <CardActionArea component={RouterLink} to={`/posts/${post.id}`}>
        {post.image_url && (
          <CardMedia
            component="img"
            image={post.image_url}
            alt={post.title}
            sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {post.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {post.users?.name ?? '알 수 없음'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.created_at)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
