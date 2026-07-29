import { Box, Typography } from '@mui/material';

const GRADIENTS = [
  'linear-gradient(150deg, #2c2c2c 0%, #0d0d0d 100%)',
  'linear-gradient(150deg, #34495e 0%, #16202a 100%)',
  'linear-gradient(150deg, #7a2036 0%, #1a1010 100%)',
  'linear-gradient(150deg, #2d4356 0%, #0e1a26 100%)',
];

export default function BrandProductRow({ label, brandUrl, products }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', color: 'text.secondary', letterSpacing: '0.04em' }}>
          {label}
        </Typography>
        <Typography
          component="a"
          href={brandUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'secondary.main', textDecoration: 'none' }}
        >
          브랜드 홈 →
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {products.map((p, i) => (
          <Box
            key={p.url}
            component="a"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              flex: '0 0 auto',
              width: 140,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 140,
                height: 175,
                borderRadius: 2.5,
                overflow: 'hidden',
                background: GRADIENTS[i % GRADIENTS.length],
              }}
            >
              <Box
                component="img"
                src={p.image}
                alt={p.name}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Typography
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                }}
              >
                {p.discount}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {p.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: 'secondary.main' }}>
                {p.discount}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: 'text.primary' }}>{p.price}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
