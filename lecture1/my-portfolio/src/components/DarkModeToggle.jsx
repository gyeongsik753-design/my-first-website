import { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../context/ThemeContext';

/* ════════════════════════════════════════════
   DarkModeToggle — 해/달 모핑 토글 버튼

   · 라이트 모드: 해 아이콘 (LightMode) - rotateIn으로 등장
   · 다크 모드:   달 아이콘 (DarkMode) - rotateIn으로 등장
   · 전환 시: 기존 아이콘 rotateOut → 새 아이콘 rotateIn
   · 스프링 이징으로 탄력 있는 회전 효과
════════════════════════════════════════════ */

const DarkModeToggle = memo(({ sx = {} }) => {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      placement="bottom"
      arrow
    >
      <IconButton
        onClick={toggle}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        size="small"
        sx={{
          color: 'var(--tm-text-1)',
          /* 버튼 자체 hover */
          transition: 'color 0.25s ease, background-color 0.25s ease',
          '&:hover': {
            bgcolor: 'rgba(128,128,128,0.12)',
          },
          ...sx,
        }}
      >
        {/* ── 아이콘 래퍼
            key가 바뀔 때마다 React가 DOM을 교체 → CSS 애니메이션 재실행
            isDark가 바뀌면 key 변경 → 새 아이콘이 rotateIn
        */}
        <span
          key={isDark ? 'dark' : 'light'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'dmToggleIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          {isDark
            ? <LightModeIcon sx={{ fontSize: '1.2rem', color: '#FFD700' }} />
            : <DarkModeIcon  sx={{ fontSize: '1.2rem', color: 'var(--tm-text-1)' }} />
          }
        </span>

        {/* CSS 키프레임 — MUI sx가 없는 <span>에 적용하려면 <style> 주입 */}
        <style>{`
          @keyframes dmToggleIn {
            from { opacity: 0; transform: rotate(-90deg) scale(0.5); }
            to   { opacity: 1; transform: rotate(0deg)   scale(1);   }
          }
        `}</style>
      </IconButton>
    </Tooltip>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';
export default DarkModeToggle;
