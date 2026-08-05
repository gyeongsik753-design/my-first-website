import { useEffect, useMemo, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, InputAdornment, Button, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import TopBarActions from '../components/TopBarActions';
import CategoryTile from '../components/CategoryTile';
import bannerCharacter from '../assets/banner-character.png';
import BrandProductRow from '../components/BrandProductRow';
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories';
import { BRANDS, BRAND_SLOTS } from '../lib/brands';
import { AAKAM_BRAND_URL, AAKAM_PRODUCTS } from '../lib/aakamProducts';
import { ARCHIVE9999_BRAND_URL, ARCHIVE9999_PRODUCTS } from '../lib/archive9999Products';
import { OY_BRAND_URL, OY_PRODUCTS } from '../lib/oyProducts';
import { COORDI_LOOKS } from '../lib/coordiLooks';

const BRAND_GRADIENTS = [
  'linear-gradient(150deg, #2c2c2c 0%, #0d0d0d 100%)',
  'linear-gradient(150deg, #34495e 0%, #16202a 100%)',
  'linear-gradient(150deg, #7a2036 0%, #1a1010 100%)',
  'linear-gradient(150deg, #2d4356 0%, #0e1a26 100%)',
  'linear-gradient(150deg, #4a2f5e 0%, #17101f 100%)',
];

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
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 진입/새로고침 시 로딩 표시
    setLoading(true);

    supabase
      .from('posts')
      .select(
        `id, caption, image_url, category, likes_count, comments_count, created_at, user_id, brand_positions, users ( username, avatar_url ), ${BRAND_SLOTS.map((s) => s.key).join(', ')}`
      )
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

  const recentOotdPosts = useMemo(
    () => posts.filter((p) => (p.category ?? DEFAULT_CATEGORY) === 'OOTD'),
    [posts]
  );

  const weeklyHotPosts = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return posts
      .filter((p) => (p.category ?? DEFAULT_CATEGORY) === 'OOTD' && new Date(p.created_at).getTime() >= weekAgo)
      .sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0))
      .slice(0, 8);
  }, [posts]);

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 0.75, gap: 0.75 }}>
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
                borderRadius: 1.5,
                overflow: 'hidden',
                background: 'linear-gradient(155deg, #1a1a1a 0%, #111111 55%, #3d0d14 100%)',
                color: '#fff',
                px: 2.5,
                py: 2,
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
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.4px)',
                  backgroundSize: '14px 14px',
                  opacity: 0.5,
                  pointerEvents: 'none',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 74,
                  bgcolor: '#F4D35E',
                  color: '#111',
                  fontSize: '0.58rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  px: 0.9,
                  py: 0.25,
                  borderRadius: '4px',
                  transform: 'rotate(-8deg)',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
                  zIndex: 2,
                }}
              >
                STREET FIT
              </Box>

              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      letterSpacing: '0.03em',
                      fontFamily: '"Roboto", cursive',
                      mb: 0.3,
                      color: '#fff',
                      WebkitTextStroke: '1px rgba(0,0,0,0.4)',
                      textShadow: '2px 2px 0 #E1263F, 2px 2px 8px rgba(225,38,63,0.4)',
                    }}
                  >
                    WITF
                  </Typography>
                  <Typography
                    sx={{
                      display: 'inline',
                      fontWeight: 900,
                      fontSize: '1.05rem',
                      lineHeight: 1.28,
                      background: 'linear-gradient(180deg, transparent 62%, rgba(225,38,63,0.55) 62%)',
                    }}
                  >
                    What Is That Fit?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 66,
                    height: 90,
                    flexShrink: 0,
                    bgcolor: '#fff',
                    borderRadius: 1.5,
                    p: 0.4,
                    transform: 'rotate(-4deg)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.45)',
                  }}
                >
                  <Box
                    component="img"
                    src={bannerCharacter}
                    alt="배너 캐릭터"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 1 }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              columnGap: 2.5,
              rowGap: 1,
              pt: 0.5,
              pb: 0.25,
            }}
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
          </Box>
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)' } }}
            />
          )}
        </Toolbar>
      </AppBar>

      {category === null && weeklyHotPosts.length > 0 && (
        <Box sx={{ pt: 2, pb: 0.5 }}>
          <Typography sx={{ px: 2, fontWeight: 800, fontSize: '0.9rem', mb: 1.2 }}>
            🔥 이번주 HOT룩
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1.5,
              overflowX: 'auto',
              px: 2,
              pb: 1,
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {weeklyHotPosts.map((post, i) => {
              const rank = i + 1;
              const top3 = rank <= 3;
              const rankColor = rank === 1 ? '#F4D35E' : rank === 2 ? '#C9C9C9' : rank === 3 ? '#CD7F32' : '#111111';
              const cardWidth = top3 ? 138 : 102;
              return (
                <Box
                  key={post.id}
                  component={RouterLink}
                  to={`/posts/${post.id}`}
                  sx={{
                    flex: '0 0 auto',
                    width: cardWidth,
                    scrollSnapAlign: 'start',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.6,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      ...(top3 && {
                        boxShadow: `0 0 0 2.5px ${rankColor}, 0 6px 16px rgba(17,17,17,0.25)`,
                      }),
                    }}
                  >
                    <Box
                      component="img"
                      src={post.image_url}
                      alt={post.caption}
                      sx={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', display: 'block' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 38%)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        minWidth: top3 ? 26 : 20,
                        height: top3 ? 26 : 20,
                        px: 0.6,
                        borderRadius: '50%',
                        bgcolor: rankColor,
                        color: top3 ? '#111' : '#fff',
                        fontSize: top3 ? '0.8rem' : '0.68rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      {rank}
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 6,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.4,
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 12, color: '#fff' }} />
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>
                        {post.likes_count ?? 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary' }} noWrap>
                    @{post.users?.username ?? 'unknown'}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {category === null && (
        <Box sx={{ pt: 1.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : recentOotdPosts.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
              아직 게시물이 없습니다. 첫 OOTD 게시물을 공유해보세요!
            </Typography>
          ) : (
            <Box>
              {recentOotdPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {category === 'BRAND' && (
        <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.78rem',
              color: 'text.secondary',
              letterSpacing: '0.06em',
              mb: 2,
            }}
          >
            브랜드 공식 홈페이지 바로가기
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {BRANDS.map((b, i) => (
              <Box
                key={b.name}
                component="a"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  width: 'calc(33.333% - 8px)',
                  height: 106,
                  borderRadius: 3,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  background: BRAND_GRADIENTS[i % BRAND_GRADIENTS.length],
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 14px rgba(17,17,17,0.22)',
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-4px) scale(1.02)', boxShadow: '0 10px 22px rgba(17,17,17,0.32)' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -28,
                    right: -28,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {b.logoSlug ? (
                    <Box
                      component="img"
                      src={`https://cdn.simpleicons.org/${b.logoSlug}/ffffff`}
                      alt={b.name}
                      sx={{ width: 25, height: 25, objectFit: 'contain' }}
                    />
                  ) : (
                    <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{b.name[0]}</Typography>
                  )}
                </Box>
                <Typography
                  sx={{
                    position: 'relative',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
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

          <BrandProductRow label="AAKAM PICK" brandUrl={AAKAM_BRAND_URL} products={AAKAM_PRODUCTS} />
          <BrandProductRow
            label="9999ARCHIVE PICK"
            brandUrl={ARCHIVE9999_BRAND_URL}
            products={ARCHIVE9999_PRODUCTS}
          />
          <BrandProductRow label="OPENYARD(OY) PICK" brandUrl={OY_BRAND_URL} products={OY_PRODUCTS} />
        </Box>
      )}

      {category === 'COORDI' && (
        <Box sx={{ px: 2, pt: 3, pb: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.78rem',
              color: 'text.secondary',
              letterSpacing: '0.06em',
              mb: 2,
            }}
          >
            코디 스타일 참고
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
            }}
          >
            {COORDI_LOOKS.map((src, i) => (
              <Box
                key={src}
                onClick={() => setLightboxIndex(i)}
                sx={{
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '3 / 4',
                  boxShadow: '0 3px 10px rgba(17,17,17,0.12)',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`코디 스타일 ${i + 1}`}
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {lightboxIndex !== null && (
        <Box
          onClick={() => setLightboxIndex(null)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1400,
            p: 3,
          }}
        >
          <Box
            component="img"
            src={COORDI_LOOKS[lightboxIndex]}
            alt={`코디 스타일 ${lightboxIndex + 1}`}
            sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 2, display: 'block' }}
          />
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
            bgcolor: 'background.paper',
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

      {category && category !== 'BRAND' && category !== 'MUSINSA' && category !== 'COORDI' && (
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
