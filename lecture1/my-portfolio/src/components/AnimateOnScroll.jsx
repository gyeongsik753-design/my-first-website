import { useRef, useState, useEffect, memo } from 'react';
import { Box } from '@mui/material';

/* ════════════════════════════════════════════
   AnimateOnScroll — 스크롤 트리거 등장 애니메이션

   · IntersectionObserver로 뷰포트 진입 감지
   · transform3d 하드웨어 가속
   · CSS @keyframes + animation-fill-mode: both
   · prefers-reduced-motion 접근성 지원
════════════════════════════════════════════ */

/* ─── 애니메이션 variants 좌표 ─── */
const VARIANTS = {
  fadeUp:    { from: 'translate3d(0, 52px, 0)',   to: 'translate3d(0, 0, 0)' },
  fadeDown:  { from: 'translate3d(0, -44px, 0)',  to: 'translate3d(0, 0, 0)' },
  fadeLeft:  { from: 'translate3d(-60px, 0, 0)',  to: 'translate3d(0, 0, 0)' },
  fadeRight: { from: 'translate3d(60px, 0, 0)',   to: 'translate3d(0, 0, 0)' },
  scaleUp:   { from: 'scale3d(0.78, 0.78, 1)',    to: 'scale3d(1, 1, 1)'    },
  flipX:     {
    from: 'perspective(700px) rotateX(14deg) translate3d(0, 28px, 0)',
    to:   'perspective(700px) rotateX(0deg)  translate3d(0, 0, 0)',
  },
  zoomIn:    { from: 'scale3d(1.12, 1.12, 1)',    to: 'scale3d(1, 1, 1)'    },
};

const AnimateOnScroll = memo(({
  children,
  variant   = 'fadeUp',
  delay     = 0,
  duration  = 0.68,
  easing    = 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  threshold = 0.15,
  once      = true,
  sx        = {},
  ...props
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const v = VARIANTS[variant] ?? VARIANTS.fadeUp;

  /* ── IntersectionObserver ── */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect(); // once=true: 한 번만 트리거
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  /* @keyframes 이름: variant 기반 (emotion이 동일 이름 중복 처리) */
  const kfName = `aos_${variant}`;

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        /* ── 초기 숨김 상태 ── */
        opacity: 0,
        transform: v.from,
        willChange: 'transform, opacity',

        /* ── 접근성: 감소 동작 선호 시 즉시 표시 ── */
        '@media (prefers-reduced-motion: reduce)': {
          opacity: 1,
          transform: 'none',
          animation: 'none !important',
          willChange: 'auto',
        },

        /* ── 뷰포트 진입 시 @keyframes 실행 ── */
        ...(visible && {
          animation: `${kfName} ${duration}s ${easing} ${delay}s both`,
        }),

        /* @keyframes 정의 (emotion 전역 주입, 동일 이름 중복 무해) */
        [`@keyframes ${kfName}`]: {
          from: { opacity: 0, transform: v.from },
          to:   { opacity: 1, transform: v.to   },
        },

        ...sx,
      }}
    >
      {children}
    </Box>
  );
});

AnimateOnScroll.displayName = 'AnimateOnScroll';
export default AnimateOnScroll;
