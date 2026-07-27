import { useEffect, useMemo, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, InputAdornment, Button, CircularProgress, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import TopBarActions from '../components/TopBarActions';
import CategoryTile from '../components/CategoryTile';
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories';
import { BRANDS } from '../lib/brands';

const BRAND_PALETTE = ['#111111', '#26313a', '#5c1a1a', '#1f2d3d', '#3a2a4a'];

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
  const [category, setCategory] = useState(null);
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

  const handleGoHome = () => {
    setCategory(null);
    setSearch('');
    setRefreshTick((tick) => tick + 1);
  };

  const currentCategoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? category;

  const filteredPosts = useMemo(() => {
    // 카테고리 컬럼이 없던 시절에 만들어진 게시물은 category가 비어있을 수 있어
    // 기본 카테고리(OOTD)로 간주해서 필터링합니다.
    let result = posts.filter((p) => (p.category ?? DEFAULT_CATEGORY) === category);
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
              onClick={handleGoHome}
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
          <Stack direction="row" spacing={3.5} justifyContent="center" sx={{ pt: 1, pb: 0.5 }}>
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.value}
                icon={c.icon}
                label={c.label}
                gradient={c.gradient}
                selected={category === c.value}
                onClick={() => setCategory(c.value)}
              />
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {category === 'BRAND' && (
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.78rem',
              color: 'text.secondary',
              textAlign: 'center',
              letterSpacing: '0.06em',
              mb: 2.5,
            }}
          >
            브랜드 공식 홈페이지 바로가기
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2.5 }}>
            {BRANDS.map((b, i) => (
              <Box
                key={b.name}
                component="a"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.8,
                  width: 76,
                  textDecoration: 'none',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: BRAND_PALETTE[i % BRAND_PALETTE.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(17,17,17,0.18)',
                  }}
                >
                  {b.logoSlug ? (
                    <Box
                      component="img"
                      src={`https://cdn.simpleicons.org/${b.logoSlug}/ffffff`}
                      alt={b.name}
                      sx={{ width: 30, height: 30, objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem' }}>{b.name[0]}</Typography>
                  )}
                </Box>
                <Typography
                  sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.primary', textAlign: 'center', lineHeight: 1.25 }}
                >
                  {b.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {!postedToday && category === 'OOTD' && (
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

      {category === null && (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
          위에서 카테고리를 선택하면 게시물을 볼 수 있어요.
        </Typography>
      )}

      {category && category !== 'BRAND' && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : filteredPosts.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
            {search ? '검색 결과가 없습니다.' : `아직 게시물이 없습니다. 첫 ${currentCategoryLabel} 게시물을 공유해보세요!`}
          </Typography>
        ) : (
          <Box sx={{ pt: 1 }}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Box>
        )
      )}
    </Box>
  );
}
