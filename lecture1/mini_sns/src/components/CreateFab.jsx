import { Box, Fab } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function CreateFab() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 84,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      <Fab
        component={RouterLink}
        to="/create"
        color="secondary"
        aria-label="새 게시물 작성"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
          boxShadow: '0 6px 16px rgba(225,38,63,0.4)',
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
