import { Box } from '@mui/material';

export default function HipCharacter({ sx }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 220 260"
      role="img"
      aria-label="야구모자와 재킷을 입은 힙한 곰 캐릭터"
      sx={{ width: '100%', height: '100%', display: 'block', ...sx }}
    >
      <defs>
        <linearGradient id="hc-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9754a" />
          <stop offset="100%" stopColor="#7c5230" />
        </linearGradient>
        <linearGradient id="hc-jacket2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b2b2b" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="250" rx="66" ry="8" fill="rgba(0,0,0,0.3)" />

      {/* shoulders / jacket body */}
      <path
        d="M46 258 Q40 190 58 160 Q80 144 110 144 Q140 144 162 160 Q180 190 174 258 Z"
        fill="url(#hc-jacket2)"
      />
      {/* jacket collar */}
      <path d="M82 150 Q110 172 138 150 L132 178 Q110 190 88 178 Z" fill="#E1263F" />
      {/* zipper */}
      <line x1="110" y1="172" x2="110" y2="250" stroke="#3a3a3a" strokeWidth="2.5" />
      {/* jacket sleeve cuffs */}
      <rect x="42" y="228" width="26" height="14" rx="6" fill="#E1263F" />
      <rect x="152" y="228" width="26" height="14" rx="6" fill="#E1263F" />

      {/* gold chain */}
      <path d="M92 168 Q110 182 128 168" stroke="#f4d35e" strokeWidth="3" fill="none" />
      <circle cx="110" cy="180" r="5" fill="#f4d35e" stroke="#c9942f" strokeWidth="1.5" />

      {/* ears */}
      <circle cx="66" cy="58" r="24" fill="url(#hc-fur)" />
      <circle cx="154" cy="58" r="24" fill="url(#hc-fur)" />
      <circle cx="66" cy="58" r="12" fill="#d8a86a" />
      <circle cx="154" cy="58" r="12" fill="#d8a86a" />

      {/* head */}
      <circle cx="110" cy="104" r="66" fill="url(#hc-fur)" />

      {/* muzzle */}
      <ellipse cx="110" cy="126" rx="36" ry="27" fill="#e7c290" />
      <ellipse cx="110" cy="112" rx="12" ry="8" fill="#3a2418" />
      <path d="M96 132 Q110 140 124 132" stroke="#5a3a20" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 120 L110 128" stroke="#5a3a20" strokeWidth="2" strokeLinecap="round" />

      {/* sunglasses */}
      <rect x="72" y="82" width="76" height="20" rx="10" fill="#0c0c0c" />
      <circle cx="92" cy="92" r="11" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
      <circle cx="128" cy="92" r="11" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
      <rect x="100" y="88" width="20" height="5" fill="#0c0c0c" />
      <path d="M78 84 Q84 76 96 78" stroke="#fff" strokeWidth="2" opacity="0.5" fill="none" />

      {/* baseball cap, tilted */}
      <path
        d="M56 66 Q60 30 110 26 Q160 30 164 66 Q136 54 110 54 Q84 54 56 66 Z"
        fill="#E1263F"
      />
      <path d="M56 66 Q38 68 26 82 Q42 84 60 72 Z" fill="#c9192f" />
      <circle cx="110" cy="32" r="5" fill="#fff" />
      <path d="M84 52 Q110 60 136 52" stroke="#c9192f" strokeWidth="3" fill="none" />
    </Box>
  );
}
