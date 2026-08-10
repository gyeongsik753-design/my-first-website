import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function CategoryTile({ icon: Icon, label, selected, onClick, color }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        flexShrink: 0,
        width: 56,
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid',
          borderColor: selected ? color : alpha(color, 0.4),
          boxShadow: selected
            ? `0 0 8px ${alpha(color, 0.9)}, 0 0 18px ${alpha(color, 0.55)}`
            : `0 0 5px ${alpha(color, 0.3)}`,
          transform: selected ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Icon sx={{ color: selected ? color : alpha(color, 0.6), fontSize: 22 }} />
      </Box>
      <Typography
        sx={{
          fontFamily: '"Permanent Marker", cursive',
          fontSize: '0.62rem',
          lineHeight: 1.2,
          color: selected ? color : alpha(color, 0.55),
          textShadow: selected ? `0 0 6px ${alpha(color, 0.6)}` : 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease, text-shadow 0.2s ease',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
