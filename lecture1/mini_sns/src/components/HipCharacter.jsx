import { Box } from '@mui/material';

export default function HipCharacter({ sx }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 220 300"
      role="img"
      aria-label="스트릿 패션 캐릭터"
      sx={{ width: '100%', height: '100%', display: 'block', ...sx }}
    >
      <defs>
        <linearGradient id="hc-jacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5470" />
          <stop offset="100%" stopColor="#7a1130" />
        </linearGradient>
        <linearGradient id="hc-pants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#454f63" />
          <stop offset="100%" stopColor="#232a38" />
        </linearGradient>
        <linearGradient id="hc-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2f20" />
          <stop offset="100%" stopColor="#1c110a" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="288" rx="64" ry="9" fill="rgba(0,0,0,0.35)" />

      {/* hair flowing behind */}
      <path
        d="M76 46 Q60 70 66 110 Q70 132 60 150 Q78 148 82 122 Q86 150 76 172 Q94 162 96 128 L96 60 Z"
        fill="url(#hc-hair)"
      />
      <path
        d="M144 46 Q160 70 154 110 Q150 132 160 150 Q142 148 138 122 Q134 150 144 172 Q126 162 124 128 L124 60 Z"
        fill="url(#hc-hair)"
      />

      {/* back arm holding bag strap */}
      <path d="M64 148 Q40 168 44 202 Q46 216 60 213 Q68 211 65 198 Q63 176 82 158 Z" fill="#7a1130" />
      <path d="M50 150 L96 260" stroke="#c9942f" strokeWidth="4" strokeLinecap="round" />
      <rect x="64" y="222" width="34" height="26" rx="6" fill="#111318" stroke="#3a3f4d" strokeWidth="1.5" />

      {/* legs, hip-popped stance */}
      <path d="M80 208 Q70 240 76 275 Q77 285 88 285 L100 285 Q106 285 104 275 L102 210 Z" fill="url(#hc-pants)" />
      <path d="M118 208 Q132 236 128 272 Q127 285 138 285 L149 285 Q155 285 152 273 L138 210 Z" fill="url(#hc-pants)" />

      {/* sneakers */}
      <path d="M72 274 L106 274 L109 288 Q109 294 99 294 L64 294 Q58 294 61 285 Z" fill="#fbfbfb" stroke="#111" strokeWidth="2" />
      <path d="M124 273 L160 273 L163 287 Q163 293 153 293 L119 293 Q113 293 115 284 Z" fill="#fbfbfb" stroke="#111" strokeWidth="2" />
      <rect x="61" y="288" width="48" height="6" rx="3" fill="#ff5470" />
      <rect x="115" y="287" width="48" height="6" rx="3" fill="#ff5470" />

      {/* crop top peek */}
      <path d="M92 150 Q110 162 128 150 L126 190 Q110 200 94 190 Z" fill="#ffe3e8" />

      {/* jacket / body */}
      <path
        d="M64 128 Q58 172 66 206 Q88 220 132 206 Q140 172 156 138 Q160 116 138 100 Q118 88 82 100 Q62 112 64 128 Z"
        fill="url(#hc-jacket)"
      />
      {/* jacket lapel split */}
      <path d="M110 100 L96 206 L102 208 L112 104 Z" fill="rgba(0,0,0,0.18)" />

      {/* front arm on hip */}
      <path
        d="M138 108 Q168 118 166 152 Q165 172 148 172 Q136 172 138 156 Q140 138 122 126 Z"
        fill="url(#hc-jacket)"
      />
      <path d="M150 155 Q168 158 170 178 Q171 190 158 190 Q148 189 150 176 Z" fill="#e0a877" />

      {/* crossbody bag strap + bag */}
      <path d="M92 100 L146 210" stroke="#f4d35e" strokeWidth="3" opacity="0.9" />
      <rect x="132" y="188" width="30" height="24" rx="6" fill="#111318" stroke="#f4d35e" strokeWidth="1.5" />

      {/* neck */}
      <rect x="100" y="80" width="20" height="18" rx="6" fill="#e0a877" />

      {/* head */}
      <circle cx="110" cy="62" r="33" fill="#e0a877" />

      {/* earring */}
      <circle cx="79" cy="76" r="4" fill="#f4d35e" stroke="#c9942f" strokeWidth="1" />

      {/* fringe / bangs */}
      <path d="M78 46 Q92 30 110 32 Q128 30 142 46 Q124 40 110 42 Q96 40 78 46 Z" fill="url(#hc-hair)" />

      {/* chain */}
      <path d="M96 92 Q110 102 124 92" stroke="#f4d35e" strokeWidth="3" fill="none" />
      <circle cx="110" cy="100" r="5" fill="#f4d35e" stroke="#c9942f" strokeWidth="1.5" />

      {/* cat-eye sunglasses */}
      <path
        d="M80 56 Q80 50 88 50 L104 50 Q110 50 110 56 L110 62 Q110 68 102 68 L90 68 Q80 68 80 60 Z"
        fill="#0c0c0c"
      />
      <path
        d="M110 56 Q110 50 118 50 L134 50 Q142 50 142 56 L142 60 Q142 68 132 68 L120 68 Q110 68 110 62 Z"
        fill="#0c0c0c"
      />
      <path d="M110 55 Q116 51 122 55" stroke="#0c0c0c" strokeWidth="4" fill="none" />
      <path d="M78 54 Q84 46 94 48" stroke="#fff" strokeWidth="2" opacity="0.55" fill="none" />

      {/* bucket cap, tilted back */}
      <path d="M78 44 Q80 16 110 14 Q140 16 142 44 Q122 34 110 34 Q98 34 78 44 Z" fill="#ff5470" />
      <path d="M78 44 Q64 46 56 56 Q68 58 82 50 Z" fill="#c9315a" />

      {/* smirk */}
      <path d="M99 78 Q110 85 121 78" stroke="#9a5a35" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="70" r="1.6" fill="#3a2418" />
      <circle cx="126" cy="70" r="1.6" fill="#3a2418" />
    </Box>
  );
}
