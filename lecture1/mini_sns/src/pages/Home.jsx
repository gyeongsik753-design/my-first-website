import { useEffect, useMemo, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, InputAdornment, Button, CircularProgress, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import TopBarActions from '../components/TopBarActions';
import { CATEGORIES } from '../lib/categories';

const ALL_CATEGORY = 'ALL';

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [postedToday, setPostedToday] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 진입/새로고침 시 로딩 표시
    setLoading(true);

    supabase
      .from('posts')
      .select('id, caption, image_url, category, likes_count, created_at, user_id, users ( username, avatar_url )')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (ignore) return;
        if (!error) {
          setPosts(data ?? []);
          if (user) setPostedToday((data ?? []).some((p) => p.user_id === user.id && isToday(p.created_at)));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user, refreshTick]);

  const handleRefresh = () => setRefreshTick((tick) => tick + 1);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (category !== ALL_CATEGORY) {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.caption?.toLowerCase().includes(q) || p.users?.username?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, search, category]);

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              onClick={handleRefresh}
              sx={{ fontWeight: 900, fontSize: '1.3rem', letterSpacing: '0.02em', cursor: 'pointer', userSelect: 'none' }}
            >
              WITF
            </Typography>
            <TopBarActions showHome={false} />
          </Box>
          <TextField
            placeholder="캡션 또는 사용자명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f5f5f5' } }}
          />
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
            <Chip
              label="전체"
              clickable
              onClick={() => setCategory(ALL_CATEGORY)}
              color={category === ALL_CATEGORY ? 'secondary' : 'default'}
              variant={category === ALL_CATEGORY ? 'filled' : 'outlined'}
            />
            {CATEGORIES.map((c) => (
              <Chip
                key={c.value}
                label={c.label}
                clickable
                onClick={() => setCategory(c.value)}
                color={category === c.value ? 'secondary' : 'default'}
                variant={category === c.value ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {!postedToday && (
        <Box
          sx={{
            m: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#fafafa',
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>오늘의 코디를 공유해보세요</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>아직 오늘 올린 OOTD가 없어요</Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/create"
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 5, whiteSpace: 'nowrap' }}
          >
            올리기
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredPosts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
          {search ? '검색 결과가 없습니다.' : '아직 게시물이 없습니다. 첫 OOTD를 공유해보세요!'}
        </Typography>
      ) : (
        <Box sx={{ pt: 1 }}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
}
