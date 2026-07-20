import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Pagination, CircularProgress } from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import PostCard from '../components/PostCard';

const PAGE_SIZE = 9;

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 페이지 변경 시 로딩 상태로 재진입
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    supabase
      .from('posts')
      .select('id, title, image_url, created_at, users ( name )', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
      .then(({ data, count: totalCount, error }) => {
        if (ignore) return;
        if (!error) {
          setPosts(data ?? []);
          setCount(totalCount ?? 0);
        }
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h1" sx={{ fontSize: '1.75rem', mb: 1 }}>
        오늘의 OOTD
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        WITF 커뮤니티에 올라온 스타일들을 둘러보세요.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          아직 게시물이 없습니다. 첫 번째 스타일을 공유해보세요!
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {posts.map((post) => (
              <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_e, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
