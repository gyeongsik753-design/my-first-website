import { useState, useEffect, memo } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { CATEGORY_CONFIG, ICON_MAP } from '../context/PortfolioContext';

/* ════════════════════════════════════════════
   SVG 기반 원형 프로그래스
   · strokeDashoffset으로 arc 길이 제어
   · requestAnimationFrame으로 count 동기화
   · drop-shadow 필터로 진행 arc glow
════════════════════════════════════════════ */
const CircularSkillProgress = memo(({ skill, visible, size = 112 }) => {
  const cat = CATEGORY_CONFIG[skill.category] || CATEGORY_CONFIG.Design;
  const icon = ICON_MAP[skill.icon] || ICON_MAP.CodeIcon;

  /* ── SVG 기하 계산 ──
     strokeWidth(sw)=8  →  원 경로 반경 r = (size - sw) / 2
     외곽 stroke 끝선 = cx + r + sw/2 = SVG 경계 (size/2)
     내부 stroke 끝선 = r - sw/2  →  inner content 지름 = (r - sw/2) × 2
  */
  const sw   = 8;
  const r    = (size - sw) / 2;         // 52 (size=112 기준)
  const cx   = size / 2;                // 56
  const cy   = size / 2;                // 56
  const circ = 2 * Math.PI * r;        // ≈ 326.73

  /* rAF 카운팅 상태 */
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) { setCount(0); return; }

    let rafId, t0;
    const dur = 1500;
    const tgt = skill.level;

    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(e * tgt));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [visible, skill.level]);

  /* arc 길이: count=0 → 전체 숨김, count=100 → 전체 표시 */
  const dashOffset = circ * (1 - count / 100);

  return (
    <Tooltip
      title={`${skill.name} · ${skill.level}%`}
      placement="top"
      arrow
    >
      <Box
        role="img"
        aria-label={`${skill.name}, 숙련도 ${skill.level}퍼센트`}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5,
          cursor: 'default',
          willChange: 'transform',
          transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': { transform: 'translateY(-6px) scale(1.06)' },
        }}
      >
        {/* ── SVG 원형 프로그래스 ── */}
        <Box sx={{ position: 'relative', width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
          >
            {/* 배경 트랙 */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#EBEBEB"
              strokeWidth={sw}
            />

            {/* ── 진행 arc — SVG path 애니메이션 ──
                strokeDasharray = 총 둘레
                strokeDashoffset = 숨길 길이 (0 = 전체 표시)
                transform: rotate(-90°) → 12시 방향에서 시작
            */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={cat.color}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90, ${cx}, ${cy})`}
              style={{
                /* rAF 프레임 간격(≈16ms)을 부드럽게 연결 */
                transition: 'stroke-dashoffset 0.03s linear',
                /* 진행 arc 글로우 */
                filter: `drop-shadow(0 0 5px ${cat.color}90)`,
              }}
            />
          </svg>

          {/* ── 중앙 내용: 아이콘 + 카운팅 퍼센트 ──
              top/left = sw (8px) → stroke inner edge에 딱 맞춤
              width/height = size - 2*sw (96px)
          */}
          <Box
            sx={{
              position: 'absolute',
              top: sw, left: sw,
              width: size - 2 * sw,
              height: size - 2 * sw,
              borderRadius: '50%',
              bgcolor: cat.bg,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 0.5,
            }}
          >
            {/* 카테고리 아이콘 */}
            <Box
              sx={{
                color: cat.color, display: 'flex',
                '& svg': { fontSize: '1.2rem !important' },
              }}
            >
              {icon}
            </Box>

            {/* rAF 카운팅 퍼센트 */}
            <Typography
              sx={{
                fontSize: '0.78rem', fontWeight: 900,
                color: cat.color, lineHeight: 1,
                /* 숫자 너비 고정 — 카운팅 시 레이아웃 흔들림 방지 */
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {count}%
            </Typography>
          </Box>
        </Box>

        {/* ── 스킬 이름 레이블 ── */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700, color: '#111',
            textAlign: 'center', lineHeight: 1.3,
            fontSize: '0.8rem',
          }}
        >
          {skill.name}
        </Typography>
      </Box>
    </Tooltip>
  );
});

CircularSkillProgress.displayName = 'CircularSkillProgress';
export default CircularSkillProgress;
