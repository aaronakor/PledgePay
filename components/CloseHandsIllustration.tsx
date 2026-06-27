export function CloseHandsIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="88" fill="#EBF7F6" />
      <circle cx="100" cy="100" r="84" stroke="#D6F0ED" strokeWidth="2" />

      {/* Left arm */}
      <path
        d="M20 130 C 30 110, 50 90, 72 82"
        stroke="#0D7C6E"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left hand */}
      <path
        d="M72 82 C 76 72, 82 68, 90 72 C 94 74, 96 78, 94 84"
        stroke="#0D7C6E"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Left thumb */}
      <path
        d="M80 76 C 76 64, 78 56, 86 58 C 92 60, 94 66, 90 72"
        stroke="#0D7C6E"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right arm */}
      <path
        d="M180 130 C 170 110, 150 90, 128 82"
        stroke="#0D7C6E"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right hand */}
      <path
        d="M128 82 C 124 72, 118 68, 110 72 C 106 74, 104 78, 106 84"
        stroke="#0D7C6E"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right thumb */}
      <path
        d="M120 76 C 124 64, 122 56, 114 58 C 108 60, 106 66, 110 72"
        stroke="#0D7C6E"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center connection / clasp */}
      <circle cx="100" cy="82" r="14" fill="#D6F0ED" />
      <circle cx="100" cy="82" r="8" fill="#EBF7F6" />

      {/* Motion arc lines */}
      <path
        d="M44 64 C 52 52, 68 44, 84 44"
        stroke="#D6F0ED"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M156 64 C 148 52, 132 44, 116 44"
        stroke="#D6F0ED"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Small decorative dots */}
      <circle cx="32" cy="98" r="4" fill="#D6F0ED" />
      <circle cx="168" cy="98" r="4" fill="#D6F0ED" />
      <circle cx="34" cy="68" r="2.5" fill="#D6F0ED" />
      <circle cx="166" cy="68" r="2.5" fill="#D6F0ED" />
      <circle cx="100" cy="36" r="3" fill="#D6F0ED" />

      {/* Sparkle accent */}
      <path d="M96 30 L98 34 L100 30 L98 26 Z" fill="#0D7C6E" opacity="0.3" />
    </svg>
  )
}
