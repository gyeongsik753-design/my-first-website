import { Box, Typography } from '@mui/material';

export default function CategoryTile({ icon: Icon, label, selected, onClick, gradient }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.6,
        cursor: 'pointer',
        flexShrink: 0,
        width: 60,
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2.5,
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid',
          borderColor: selected ? '#111111' : 'transparent',
          boxShadow: selected ? '0 4px 12px rgba(17,17,17,0.25)' : 'none',
          transform: selected ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Icon sx={{ color: '#fff', fontSize: 26 }} />
      </Box>
      <Typography
        sx={{
          fontSize: '0.7rem',
          fontWeight: selected ? 800 : 600,
          color: selected ? 'text.primary' : 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
