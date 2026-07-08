import { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';

/* ════════════════════════════════════════════
   CustomCursor — 커스텀 커서 시스템

   구성요소
   ① 도트    — 마우스 정확 위치, mix-blend-mode:difference
   ② 링      — Lerp 지연 추적, 호버 시 scale/color 변형
   ③ 트레일  — 7개 파티클, rAF 히스토리 기반 흔적
   ④ 자기장  — 버튼/링크 근처에서 링이 끌려가는 효과

   성능 원칙
   · DOM 위치 업데이트: transform3d 전용 (레이아웃 없음)
   · 색상/투명도 전환: CSS transition (GPU 합성)
   · 스케일 전환: Lerp in rAF (GPU 합성)
   · getBoundingClientRect: 2 프레임마다만 호출
   · DOM 쿼리(querySelectorAll): 2초마다만 갱신
   · 터치/모바일: pointer:fine 체크 후 비활성
════════════════════════════════════════════ */

/* ─── 상수 ─── */
const TRAIL_N      = 7;    // 트레일 파티클 수
const RING_LERP    = 0.10; // 링 위치 지연 계수 (낮을수록 더 느림)
const SCALE_LERP   = 0.13; // 링 스케일 전환 계수
const MAG_RADIUS   = 88;   // 자기장 반경 (px)
const MAG_STRENGTH = 0.30; // 자기장 당김 강도 (0=없음, 1=완전히 끌림)

/* ─── 커서 상태별 링 설정 ─── */
const RING_CFG = {
  default: { scale: 1,    border: 'rgba(200,16,46,0.72)', bg: 'transparent',           opacity: 1 },
  link:    { scale: 1.55, border: '#C8102E',              bg: 'rgba(200,16,46,0.07)',  opacity: 1 },
  button:  { scale: 1.82, border: '#C8102E',              bg: 'rgba(200,16,46,0.13)',  opacity: 1 },
  active:  { scale: 0.65, border: '#C8102E',              bg: 'rgba(200,16,46,0.32)',  opacity: 1 },
  hidden:  { scale: 1,    border: 'transparent',          bg: 'transparent',           opacity: 0 },
};

/* ─── 인터랙티브 요소 선택자 ─── */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

const CustomCursor = () => {

  /* ────────────────────────────────
     기기 감지 (동기 — 렌더 시 즉시 평가)
     pointer:fine = 마우스/트랙패드
     touch 기기에서는 컴포넌트 전체 비활성
  ──────────────────────────────── */
  const isMouseDevice = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches
  );

  /* ─── DOM refs ─── */
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const trailRef = useRef([]);           // trailRef.current[0..TRAIL_N-1]

  /* ─── rAF 전용 상태 refs (렌더 트리거 없음) ─── */
  const mouse      = useRef({ x: -400, y: -400 });
  const ringPos    = useRef({ x: -400, y: -400, tx: -400, ty: -400 });
  const ringScale  = useRef(1);
  const posHistory = useRef(Array(TRAIL_N).fill({ x: -400, y: -400 }));
  const frameN     = useRef(0);
  const magEls     = useRef([]);
  const rafId      = useRef(null);
  const entered    = useRef(false);
  const variantRef = useRef('default');  // rAF에서 읽는 현재 상태

  /* ─── React 상태: CSS transition(색상/투명도)용 ─── */
  const [variant, setVariant] = useState('default');
  const cfg = RING_CFG[variant] ?? RING_CFG.default;

  /* ────────────────────────────────
     useEffect: 이벤트 + rAF 루프
  ──────────────────────────────── */
  useEffect(() => {
    if (!isMouseDevice.current) return;

    /* ── 네이티브 커서 완전 숨김 ── */
    const styleEl = document.createElement('style');
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(styleEl);

    /* ── variant 업데이터 (effect 내부 정의 → 클로저 안전) ── */
    const setV = (v) => {
      variantRef.current = v;
      setVariant(v);
    };

    /* ── 마우스 이동 ── */
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!entered.current) {
        /* 첫 진입: 링과 트레일 히스토리를 현재 위치로 초기화 */
        const p = { x: e.clientX, y: e.clientY };
        ringPos.current  = { x: p.x, y: p.y, tx: p.x, ty: p.y };
        posHistory.current = Array(TRAIL_N).fill(p);
        entered.current = true;
      }
    };

    /* ── 호버 감지 (이벤트 위임) ── */
    const onOver = (e) => {
      const el = e.target?.closest?.(INTERACTIVE);
      if (!el) return;
      const isBtn = el.tagName === 'BUTTON' || el.getAttribute('role') === 'button';
      setV(isBtn ? 'button' : 'link');
    };

    const onOut = (e) => {
      const still = e.relatedTarget?.closest?.(INTERACTIVE);
      if (!still) setV('default');
    };

    /* ── 클릭 압축 효과 ── */
    const onDown  = () => { if (variantRef.current !== 'hidden') setV('active'); };
    const onUp    = () => { if (variantRef.current === 'active') setV('default'); };

    /* ── 창 이탈/재진입 ── */
    const onLeave = () => { entered.current = false; setV('hidden'); };
    const onEnter = () => { entered.current = true;  setV('default'); };

    /* ══════════════════════════════════
       rAF 메인 루프
    ══════════════════════════════════ */
    const animate = () => {
      frameN.current++;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      /* ── 자기장 계산 (2 프레임마다 — 30fps) ── */
      if (frameN.current % 2 === 0) {

        /* 2초(120프레임)마다 DOM 쿼리 갱신 */
        if (frameN.current % 120 === 0) {
          magEls.current = Array.from(document.querySelectorAll('a, button'));
        }

        let tx = mx, ty = my;
        let nearest = MAG_RADIUS;

        magEls.current.forEach((el) => {
          if (!el.isConnected) return; // unmounted 요소 건너뜀
          const r  = el.getBoundingClientRect();
          const cx = r.left + r.width  * 0.5;
          const cy = r.top  + r.height * 0.5;
          const d  = Math.hypot(mx - cx, my - cy);
          if (d < nearest) {
            nearest = d;
            /* 거리에 반비례하는 당김 강도 */
            const pull = (1 - d / MAG_RADIUS) * MAG_STRENGTH;
            tx = mx + (cx - mx) * pull;
            ty = my + (cy - my) * pull;
          }
        });

        /* 자기장 결과를 링의 Lerp 타겟으로 저장 */
        ringPos.current.tx = tx;
        ringPos.current.ty = ty;
      }

      /* ── 링 위치 Lerp ── */
      ringPos.current.x += (ringPos.current.tx - ringPos.current.x) * RING_LERP;
      ringPos.current.y += (ringPos.current.ty - ringPos.current.y) * RING_LERP;

      /* ── 링 스케일 Lerp ── */
      const tgtScale = RING_CFG[variantRef.current]?.scale ?? 1;
      ringScale.current += (tgtScale - ringScale.current) * SCALE_LERP;

      /* ── DOM 업데이트: transform3d 전용 ──
         transform3d → GPU 합성 레이어, 레이아웃 불변
      */
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
      }

      if (ringRef.current) {
        const rx = ringPos.current.x.toFixed(1);
        const ry = ringPos.current.y.toFixed(1);
        const rs = ringScale.current.toFixed(3);
        ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${rs})`;
      }

      /* ── 트레일 히스토리 업데이트 ── */
      posHistory.current = [
        { x: mx, y: my },
        ...posHistory.current.slice(0, TRAIL_N - 1),
      ];

      trailRef.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = posHistory.current[i];
        const scale   = (1 - (i / TRAIL_N) * 0.72).toFixed(2);
        const opacity = ((1 - i / TRAIL_N) * 0.42).toFixed(2);
        el.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        el.style.opacity   = opacity;
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseover',  onOver,  { passive: true });
    document.addEventListener('mouseout',   onOut,   { passive: true });
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      /* 네이티브 커서 복원 */
      if (document.head.contains(styleEl)) document.head.removeChild(styleEl);
    };
  }, []); // 마운트 1회 실행

  /* 터치 기기 → 렌더하지 않음 */
  if (!isMouseDevice.current) return null;

  return (
    <>
      {/* ① 트레일 파티클 (zIndex: 9997)
          7개 고정 DOM 요소, rAF가 직접 transform/opacity 업데이트
      */}
      {Array.from({ length: TRAIL_N }).map((_, i) => (
        <Box
          key={i}
          ref={(el) => { trailRef.current[i] = el; }}
          aria-hidden="true"
          sx={{
            position: 'fixed', top: 0, left: 0,
            width: 6, height: 6,
            borderRadius: '50%',
            bgcolor: '#C8102E',
            marginTop: '-3px', marginLeft: '-3px',
            pointerEvents: 'none',
            zIndex: 9997,
            willChange: 'transform, opacity',
            /* 초기: 화면 밖 */
            transform: 'translate3d(-400px,-400px,0)',
          }}
        />
      ))}

      {/* ② 링 팔로워 (zIndex: 9998)
          · 항상 32×32px — 크기 변화는 scale3d (레이아웃 불변)
          · 색상/투명도만 CSS transition (GPU 합성, React 상태 변경 시)
          · 위치/스케일은 rAF → transform3d (매 프레임 직접 DOM 업데이트)
      */}
      <Box
        ref={ringRef}
        aria-hidden="true"
        sx={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          borderRadius: '50%',
          /* ▼ React 상태 제어 속성 (CSS transition 대상) */
          border: `1.5px solid ${cfg.border}`,
          bgcolor: cfg.bg,
          opacity: cfg.opacity,
          /* ─ */
          marginTop: '-16px', marginLeft: '-16px',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          /* 색상/투명도만 전환 (transform은 rAF 직접 제어) */
          transition: [
            'border-color 0.22s ease',
            'background-color 0.22s ease',
            'opacity 0.28s ease',
          ].join(', '),
          transform: 'translate3d(-400px,-400px,0)',
        }}
      />

      {/* ③ 도트 커서 (zIndex: 9999)
          · mix-blend-mode: difference → 배경 반전
            어두운 배경: 흰 점, 밝은 배경: 검은 점 — 어디서나 선명
          · 마우스 정확 위치 (lerp 없음, 딜레이 없음)
      */}
      <Box
        ref={dotRef}
        aria-hidden="true"
        sx={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          bgcolor: '#ffffff',
          marginTop: '-4px', marginLeft: '-4px',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          /* 반전 블렌드 — 네이티브 커서가 보이던 곳에서 항상 눈에 띔 */
          mixBlendMode: 'difference',
          opacity: variant === 'hidden' ? 0 : 1,
          transition: 'opacity 0.28s ease',
          transform: 'translate3d(-400px,-400px,0)',
        }}
      />
    </>
  );
};

export default CustomCursor;
