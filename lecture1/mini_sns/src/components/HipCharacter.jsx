import { Box } from '@mui/material';

export default function HipCharacter({ sx }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 200 300"
      role="img"
      aria-label="테크웨어 비니와 올리브 봄버 재킷을 입은 캐릭터"
      sx={{ width: '100%', height: '100%', display: 'block', ...sx }}
    >
      <defs>
        <linearGradient id="hc-jacket3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a7a5c" />
          <stop offset="100%" stopColor="#565640" />
        </linearGradient>
        <linearGradient id="hc-pants2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232a3a" />
          <stop offset="100%" stopColor="#12151e" />
        </linearGradient>
        <linearGradient id="hc-bag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8a68" />
          <stop offset="100%" stopColor="#6a6a4e" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="292" rx="58" ry="8" fill="rgba(0,0,0,0.3)" />

      {/* boots */}
      <path d="M64 262 L96 262 L98 280 Q98 288 88 288 L58 288 Q52 288 54 279 Z" fill="#c8b088" stroke="#3a2e1c" strokeWidth="1.5" />
      <path d="M104 262 L136 262 L138 279 Q140 288 130 288 L104 288 Q98 288 100 280 Z" fill="#b89e76" stroke="#3a2e1c" strokeWidth="1.5" />

      {/* legs / cargo pants */}
      <path d="M70 176 Q62 220 64 260 L98 260 Q100 220 96 178 Z" fill="url(#hc-pants2)" />
      <path d="M104 178 Q100 220 102 260 L136 260 Q138 220 130 176 Z" fill="url(#hc-pants2)" />

      {/* cargo pocket flaps */}
      <path d="M66 208 L94 206 L96 232 L68 234 Z" fill="#1a1e28" stroke="#333c4d" strokeWidth="1.2" />
      <path d="M106 206 L132 208 L130 234 L104 232 Z" fill="#1a1e28" stroke="#333c4d" strokeWidth="1.2" />

      {/* hanging keychain */}
      <circle cx="82" cy="238" r="4" fill="none" stroke="#c9c9c9" strokeWidth="1.5" />
      <line x1="85" y1="240" x2="90" y2="252" stroke="#c9c9c9" strokeWidth="1.5" />
      <rect x="86" y="252" width="8" height="10" rx="1.5" fill="#8a5a34" />
      <path d="M90 252 L94 244 L98 252" stroke="#c9c9c9" strokeWidth="1.5" fill="none" />

      {/* belt */}
      <rect x="68" y="172" width="64" height="6" rx="2" fill="#1c1c1c" />

      {/* crossbody bag strap */}
      <path d="M60 118 L150 214" stroke="#4a4a36" strokeWidth="10" strokeLinecap="round" />
      {/* bag */}
      <path d="M126 196 L166 202 L162 236 L122 230 Z" fill="url(#hc-bag)" stroke="#4a4a36" strokeWidth="1.5" />
      <path d="M128 200 L160 205" stroke="#4a4a36" strokeWidth="2" />

      {/* jacket body */}
      <path
        d="M56 128 Q48 168 56 180 Q100 196 144 180 Q152 168 144 128 Q148 104 122 92 Q100 82 78 92 Q52 104 56 128 Z"
        fill="url(#hc-jacket3)"
      />
      {/* ribbed hem */}
      <path d="M58 176 Q100 190 142 176 L142 182 Q100 196 58 182 Z" fill="#40402e" />
      {/* zipper */}
      <line x1="100" y1="98" x2="100" y2="184" stroke="#2a2a1e" strokeWidth="2" />
      {/* chest pocket */}
      <rect x="108" y="120" width="16" height="12" rx="2" fill="#4a4a36" />
      {/* sleeves + ribbed cuffs (hands in pockets) */}
      <path d="M56 128 Q44 148 46 172 Q48 182 60 180 L62 160 Q58 144 68 130 Z" fill="url(#hc-jacket3)" />
      <path d="M144 128 Q156 148 154 172 Q152 182 140 180 L138 160 Q142 144 132 130 Z" fill="url(#hc-jacket3)" />
      <rect x="45" y="170" width="16" height="10" rx="4" fill="#40402e" />
      <rect x="139" y="170" width="16" height="10" rx="4" fill="#40402e" />

      {/* undershirt peek */}
      <path d="M88 92 Q100 104 112 92 L108 84 Q100 90 92 84 Z" fill="#141414" />

      {/* neck */}
      <rect x="92" y="76" width="16" height="16" rx="5" fill="#e0a877" />

      {/* head */}
      <ellipse cx="100" cy="58" rx="28" ry="30" fill="#e0a877" />

      {/* downward gaze eyes */}
      <path d="M86 62 Q90 66 96 63" stroke="#2a1a12" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M104 63 Q110 66 114 62" stroke="#2a1a12" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* nose + neutral mouth */}
      <path d="M100 66 L98 74" stroke="#c98a5c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="94" y1="80" x2="106" y2="80" stroke="#8a5a3a" strokeWidth="2" strokeLinecap="round" />

      {/* beanie */}
      <path d="M70 46 Q70 16 100 12 Q130 16 130 46 Q130 54 122 54 L78 54 Q70 54 70 46 Z" fill="#161616" />
      <line x1="72" y1="38" x2="128" y2="38" stroke="#2a2a2a" strokeWidth="2" />
      <line x1="72" y1="46" x2="128" y2="46" stroke="#2a2a2a" strokeWidth="2" />
      <path d="M70 46 Q100 58 130 46 L130 50 Q100 62 70 50 Z" fill="#0e0e0e" />
      {/* small star patch */}
      <path
        d="M92 30 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0 z"
        fill="#E1263F"
      />
    </Box>
  );
}
