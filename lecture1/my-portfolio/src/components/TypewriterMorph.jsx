import { useState, useEffect, memo } from 'react';
import { Box } from '@mui/material';

/* ════════════════════════════════════════════
   TypewriterMorph — 롤 모퍼 컴포넌트

   ① 타이핑 효과: 글자 하나씩 등장 (setTimeout 체인)
   ② 글자별 애니메이션: charIn — translateY + scale 미세 등장
   ③ 그라데이션 텍스트: background-clip:text + 움직이는 shimmer
   ④ 반복 모핑: typing → wait → deleting → next role → typing

   Props:
     startDelay  ms — 마운트 후 타이핑 시작까지 지연 (default: 0)
     sx          MUI sx — 외부 래퍼 스타일 오버라이드
════════════════════════════════════════════ */

const ROLES = ['개발자', '디자이너', '크리에이터'];

/* ─── 타이밍 상수 ─── */
const TYPE_SPD   = 108;  // ms: 타이핑 속도 (글자 당)
const DEL_SPD    = 62;   // ms: 지우기 속도
const WAIT_DONE  = 1900; // ms: 단어 완성 후 일시정지
const WAIT_EMPTY = 360;  // ms: 완전히 지운 후 다음 단어 시작 전

/* ─── 역할별 그라데이션 ─── */
const ROLE_GRADIENTS = [
  /* 개발자 */  'linear-gradient(90deg, #C8102E 0%, #FF4D6D 35%, #ffffff 55%, #FF4D6D 75%, #C8102E 100%)',
  /* 디자이너 */ 'linear-gradient(90deg, #C8102E 0%, #FF6B35 35%, #ffffff 55%, #FF6B35 75%, #C8102E 100%)',
  /* 크리에이터 */ 'linear-gradient(90deg, #8B0000 0%, #C8102E 35%, #FF6B6B 55%, #C8102E 75%, #8B0000 100%)',
];

/* ─── 타이핑 커서 ─── */
const TypeCursor = () => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: 'inline-block',
      width: '2px',
      height: '1.05em',
      bgcolor: '#C8102E',
      ml: '3px',
      verticalAlign: 'middle',
      flexShrink: 0,
      animation: 'tmCursorBlink 0.9s step-end infinite',
      '@keyframes tmCursorBlink': {
        '0%, 100%': { opacity: 1 },
        '50%':       { opacity: 0 },
      },
    }}
  />
);

/* ════════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════════ */
const TypewriterMorph = memo(({ startDelay = 0, sx = {}, ...props }) => {

  /* ── 상태 ── */
  const [roleIdx,  setRoleIdx]  = useState(0);
  const [chars,    setChars]    = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [ready,    setReady]    = useState(startDelay === 0);

  const role = ROLES[roleIdx];

  /* ── 초기 지연: 마운트 후 startDelay ms 뒤에 타이핑 시작 ── */
  useEffect(() => {
    if (startDelay === 0) return;
    const t = setTimeout(() => setReady(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  /* ── 타이핑 상태 머신 ──
     ready=false → 대기 (timer 없음)

     typing  & chars < len  → chars++  (TYPE_SPD ms)
     typing  & chars = len  → switch to deleting (WAIT_DONE ms)
     deleting & chars > 0   → chars--  (DEL_SPD ms)
     deleting & chars = 0   → next role, back to typing (WAIT_EMPTY ms)
  */
  useEffect(() => {
    if (!ready) return;
    let timer;

    if (!deleting) {
      if (chars < role.length) {
        timer = setTimeout(() => setChars((c) => c + 1), TYPE_SPD);
      } else {
        /* 단어 완성 → 잠시 보여주다가 지우기 시작 */
        timer = setTimeout(() => setDeleting(true), WAIT_DONE);
      }
    } else {
      if (chars > 0) {
        timer = setTimeout(() => setChars((c) => c - 1), DEL_SPD);
      } else {
        /* 완전히 지움 → 다음 역할로 */
        timer = setTimeout(() => {
          setRoleIdx((i) => (i + 1) % ROLES.length);
          setDeleting(false);
        }, WAIT_EMPTY);
      }
    }

    return () => clearTimeout(timer);
  }, [ready, deleting, chars, role.length]);

  const displayed = role.slice(0, chars);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}
      {...props}
    >
      <Box
        component="p"
        role="status"
        aria-live="polite"
        aria-label={`직업: ${ROLES[roleIdx]}`}
        sx={{
          m: 0,
          display: 'flex',
          alignItems: 'center',
          fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
          fontWeight: 400,
          letterSpacing: '0.04em',
          lineHeight: 1.2,
        }}
      >
        {/* ── "I'm a" 레이블 ── */}
        <Box component="span" sx={{
          color: 'rgba(255,255,255,0.28)',
          fontWeight: 300,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: '0.7em',
          mr: '0.55em',
          userSelect: 'none',
        }}>
          I'm a
        </Box>

        {/* ── 그라데이션 텍스트 래퍼 ──
            · background-clip: text → 배경이 텍스트 모양으로 클리핑
            · background-position 애니메이션 → 좌우 shimmer
            · roleIdx 변경 시 그라데이션도 전환
        */}
        <Box component="span" sx={{
          background: ROLE_GRADIENTS[roleIdx],
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          /* 그라데이션 전환 부드럽게 */
          transition: 'background 0.6s ease',
          /* 움직이는 shimmer — background-position 반복 */
          animation: 'tmGradShimmer 3.2s ease-in-out infinite',
          '@keyframes tmGradShimmer': {
            '0%, 100%': { backgroundPosition: '0% 50%'   },
            '50%':       { backgroundPosition: '100% 50%' },
          },
        }}>
          {/* ── 글자별 등장 애니메이션 ──
              key = `roleIdx-i` → 역할 바뀔 때 + 새 글자 추가 시만 remount
              remount 시 charIn 애니메이션이 다시 트리거
          */}
          {displayed.split('').map((char, i) => (
            <Box
              key={`${roleIdx}-${i}`}
              component="span"
              sx={{
                display: 'inline-block',
                animation: 'tmCharIn 0.18s cubic-bezier(0.22, 0.61, 0.36, 1) both',
                '@keyframes tmCharIn': {
                  from: { opacity: 0, transform: 'translateY(-7px) scale(0.75)' },
                  to:   { opacity: 1, transform: 'translateY(0)    scale(1)'    },
                },
              }}
            >
              {char}
            </Box>
          ))}

          {/* 빈 텍스트일 때 폭 유지 (공백) */}
          {displayed.length === 0 && (
            <Box component="span" sx={{ opacity: 0, userSelect: 'none' }}>
              {role}
            </Box>
          )}
        </Box>

        {/* ── 타이핑 커서 ── */}
        <TypeCursor />
      </Box>
    </Box>
  );
});

TypewriterMorph.displayName = 'TypewriterMorph';
export default TypewriterMorph;
