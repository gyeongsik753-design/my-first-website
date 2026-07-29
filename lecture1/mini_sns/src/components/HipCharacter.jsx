import { Box } from '@mui/material';

export default function HipCharacter({ sx }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 220 260"
      role="img"
      aria-label="야구모자와 헤드폰을 착용한 힙한 고양이 캐릭터"
      sx={{ width: '100%', height: '100%', display: 'block', ...sx }}
    >
      <defs>
        <linearGradient id="hc-catfur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2c07a" />
          <stop offset="100%" stopColor="#e0a45a" />
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
      <path d="M82 150 Q110 172 138 150 L132 178 Q110 190 88 178 Z" fill="#E1263F" />
      <line x1="110" y1="172" x2="110" y2="250" stroke="#3a3a3a" strokeWidth="2.5" />
      <rect x="42" y="228" width="26" height="14" rx="6" fill="#E1263F" />
      <rect x="152" y="228" width="26" height="14" rx="6" fill="#E1263F" />

      {/* gold chain */}
      <path d="M92 168 Q110 182 128 168" stroke="#f4d35e" strokeWidth="3" fill="none" />
      <circle cx="110" cy="180" r="5" fill="#f4d35e" stroke="#c9942f" strokeWidth="1.5" />

      {/* headphones worn around the neck */}
      <path d="M62 168 Q110 208 158 168" stroke="#111318" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="166" r="15" fill="#1c1c1c" stroke="#E1263F" strokeWidth="3" />
      <circle cx="160" cy="166" r="15" fill="#1c1c1c" stroke="#E1263F" strokeWidth="3" />
      <circle cx="60" cy="166" r="6" fill="#3a3a3a" />
      <circle cx="160" cy="166" r="6" fill="#3a3a3a" />

      {/* cat ears */}
      <path d="M56 58 L44 16 L82 46 Z" fill="url(#hc-catfur)" />
      <path d="M164 58 L176 16 L138 46 Z" fill="url(#hc-catfur)" />
      <path d="M58 50 L52 26 L74 44 Z" fill="#ffd7ad" />
      <path d="M162 50 L168 26 L146 44 Z" fill="#ffd7ad" />

      {/* head */}
      <circle cx="110" cy="104" r="64" fill="url(#hc-catfur)" />

      {/* blush */}
      <ellipse cx="72" cy="118" rx="10" ry="6" fill="#ff9fae" opacity="0.6" />
      <ellipse cx="148" cy="118" rx="10" ry="6" fill="#ff9fae" opacity="0.6" />

      {/* muzzle */}
      <ellipse cx="110" cy="128" rx="30" ry="20" fill="#fff3e0" />

      {/* nose */}
      <path d="M104 110 L116 110 L110 118 Z" fill="#ff6f91" />

      {/* mouth */}
      <path d="M110 118 L110 124" stroke="#7a4a2a" strokeWidth="2" strokeLinecap="round" />
      <path d="M110 124 Q100 132 90 124" stroke="#7a4a2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M110 124 Q120 132 130 124" stroke="#7a4a2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* whiskers */}
      <line x1="46" y1="112" x2="80" y2="116" stroke="#fff" strokeWidth="1.6" opacity="0.85" />
      <line x1="44" y1="122" x2="79" y2="122" stroke="#fff" strokeWidth="1.6" opacity="0.85" />
      <line x1="174" y1="112" x2="140" y2="116" stroke="#fff" strokeWidth="1.6" opacity="0.85" />
      <line x1="176" y1="122" x2="141" y2="122" stroke="#fff" strokeWidth="1.6" opacity="0.85" />

      {/* big sparkly eyes */}
      <circle cx="86" cy="94" r="13" fill="#20140c" />
      <circle cx="134" cy="94" r="13" fill="#20140c" />
      <circle cx="90" cy="89" r="4" fill="#fff" />
      <circle cx="138" cy="89" r="4" fill="#fff" />
      <circle cx="83" cy="99" r="2" fill="#fff" opacity="0.8" />
      <circle cx="131" cy="99" r="2" fill="#fff" opacity="0.8" />

      {/* baseball cap, tilted */}
      <path d="M56 66 Q60 30 110 26 Q160 30 164 66 Q136 54 110 54 Q84 54 56 66 Z" fill="#E1263F" />
      <path d="M56 66 Q38 68 26 82 Q42 84 60 72 Z" fill="#c9192f" />
      <circle cx="110" cy="32" r="5" fill="#fff" />
      <path d="M84 52 Q110 60 136 52" stroke="#c9192f" strokeWidth="3" fill="none" />
    </Box>
  );
}
