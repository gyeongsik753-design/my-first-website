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
      <ellipse cx="110" cy="288" rx="66" ry="9" fill="rgba(0,0,0,0.35)" />

      {/* back arm */}
      <path d="M62 148 Q36 172 42 208 Q45 224 60 220 Q68 217 65 202 Q62 178 80 158 Z" fill="#c81f36" />

      {/* legs */}
      <path d="M78 205 L74 275 Q74 285 85 285 L100 285 Q106 285 105 275 L104 205 Z" fill="#cfcfcf" />
      <path d="M116 205 L114 275 Q113 285 124 285 L139 285 Q145 285 144 275 L142 205 Z" fill="#b9b9b9" />

      {/* sneakers */}
      <path d="M72 275 L108 275 L110 288 Q110 294 100 294 L66 294 Q60 294 62 286 Z" fill="#f5f5f5" stroke="#111" strokeWidth="2" />
      <path d="M111 275 L147 275 L149 288 Q149 294 139 294 L105 294 Q99 294 101 286 Z" fill="#f5f5f5" stroke="#111" strokeWidth="2" />
      <rect x="62" y="289" width="48" height="6" rx="3" fill="#111" />
      <rect x="101" y="289" width="48" height="6" rx="3" fill="#111" />

      {/* hoodie body */}
      <path d="M62 130 Q58 190 66 215 Q110 232 154 215 Q162 190 158 130 Q160 108 140 96 Q110 84 80 96 Q60 108 62 130 Z" fill="#242424" />

      {/* pocket */}
      <path d="M85 175 Q110 190 135 175 L135 195 Q110 208 85 195 Z" fill="#181818" />

      {/* zipper */}
      <line x1="110" y1="98" x2="110" y2="212" stroke="#3a3a3a" strokeWidth="2" />

      {/* shirt peek */}
      <path d="M92 98 Q110 112 128 98 L124 88 Q110 96 96 88 Z" fill="#e1263f" />

      {/* hood strings */}
      <line x1="103" y1="100" x2="100" y2="130" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="117" y1="100" x2="120" y2="130" stroke="#111" strokeWidth="3" strokeLinecap="round" />

      {/* front arm crossed */}
      <path d="M150 140 Q178 155 172 190 Q168 208 150 202 Q140 198 145 182 Q150 165 132 150 Z" fill="#e1263f" />
      <circle cx="152" cy="200" r="10" fill="#e0a877" />

      {/* neck */}
      <rect x="100" y="80" width="20" height="18" rx="6" fill="#e0a877" />

      {/* head */}
      <circle cx="110" cy="62" r="34" fill="#e0a877" />
      <circle cx="76" cy="64" r="6" fill="#e0a877" />

      {/* chain */}
      <path d="M96 92 Q110 102 124 92" stroke="#f4d35e" strokeWidth="3" fill="none" />
      <circle cx="110" cy="100" r="5" fill="#f4d35e" stroke="#c9a227" strokeWidth="1.5" />

      {/* sunglasses */}
      <rect x="82" y="54" width="56" height="16" rx="8" fill="#0c0c0c" />
      <circle cx="96" cy="62" r="9" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
      <circle cx="124" cy="62" r="9" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
      <rect x="102" y="59" width="16" height="4" fill="#0c0c0c" />
      <path d="M96 56 Q92 50 84 52" stroke="#fff" strokeWidth="2" opacity="0.5" fill="none" />

      {/* cap */}
      <path d="M74 46 Q78 16 110 14 Q142 16 146 46 Q124 38 110 38 Q96 38 74 46 Z" fill="#e1263f" />
      <path d="M74 46 Q60 48 52 58 Q64 60 78 52 Z" fill="#c81f36" />
      <circle cx="110" cy="20" r="4" fill="#fff" />

      {/* smirk */}
      <path d="M100 78 Q110 84 120 78" stroke="#7a4a2a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Box>
  );
}
