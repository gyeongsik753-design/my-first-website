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
import HipCharacter from '../components/HipCharacter';
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
      result = result.filter((p) => p.users?.username?.toLowerCase().includes(q));
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

          {category === null && (
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(155deg, #1a1a1a 0%, #111111 55%, #3d0d14 100%)',
                color: '#fff',
                px: 3,
                py: 4.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(225,38,63,0.55) 0%, rgba(225,38,63,0) 70%)',
                },
              }}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '1.5rem',
                      letterSpacing: '0.02em',
                      fontFamily: '"Roboto", cursive',
                      mb: 0.5,
                    }}
                  >
                    WITF
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', lineHeight: 1.32 }}>
                    What Is That Fit?
                  </Typography>
                </Box>
                <Box sx={{ width: 92, height: 126, flexShrink: 0 }}>
                  <HipCharacter />
                </Box>
              </Box>
            </Box>
          )}

          <Stack
            direction="row"
            spacing={2.5}
            justifyContent="center"
            sx={{ pt: 1, pb: 0.5, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
          >
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
          {category === 'OOTD' && (
            <TextField
              placeholder="사용자명 검색"
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
          )}
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

      {category === 'MUSINSA' && (
        <Box sx={{ px: 2, pt: 3, pb: 1 }}>
          <Box
            component="a"
            href="https://www.musinsa.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #FF6B35, #C9302C)',
              color: '#fff',
              px: 2.5,
              py: 2.5,
              mb: 3,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                opacity: 0.85,
                mb: 0.5,
                textTransform: 'uppercase',
              }}
            >
              MUSINSA SALE
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', lineHeight: 1.3 }}>
              지금 할인 중인 상품 보러가기
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', opacity: 0.85, mt: 0.5 }}>
              musinsa.com에서 실시간 세일 상품을 확인하세요
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.78rem',
              color: 'text.secondary',
              letterSpacing: '0.04em',
              mb: 1.5,
            }}
          >
            인기 브랜드 미리보기
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {BRANDS.slice(0, 3).map((b, i) => (
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
                  justifyContent: 'center',
                  gap: 1,
                  flex: '1 1 0',
                  height: 92,
                  borderRadius: 2.5,
                  textDecoration: 'none',
                  background: BRAND_PALETTE[i % BRAND_PALETTE.length],
                  boxShadow: '0 4px 12px rgba(17,17,17,0.18)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}
              >
                {b.logoSlug ? (
                  <Box
                    component="img"
                    src={`https://cdn.simpleicons.org/${b.logoSlug}/ffffff`}
                    alt={b.name}
                    sx={{ width: 32, height: 32, objectFit: 'contain' }}
                  />
                ) : (
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>{b.name[0]}</Typography>
                )}
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>{b.name}</Typography>
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => setCategory('BRAND')}
            sx={{ mt: 2, borderRadius: 5 }}
          >
            브랜드 전체 보기 →
          </Button>
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

      {category && category !== 'BRAND' && category !== 'MUSINSA' && (
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
