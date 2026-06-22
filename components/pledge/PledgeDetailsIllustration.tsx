/**
 * Pledge details step illustration – a clipboard/document with
 * a checkmark and a naira coin, matching the design's Step 2 illustration.
 */
export function PledgeDetailsIllustration() {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="70" cy="56" r="46" fill="#EBF7F6" />

      {/* Clipboard body */}
      <rect x="44" y="22" width="52" height="66" rx="8" fill="#0D7C6E" />
      <rect x="48" y="28" width="44" height="56" rx="5" fill="white" />

      {/* Clipboard clip */}
      <rect x="58" y="18" width="24" height="10" rx="5" fill="#064E45" />

      {/* Document lines */}
      <rect x="54" y="38" width="28" height="3" rx="1.5" fill="#D6F0ED" />
      <rect x="54" y="46" width="22" height="3" rx="1.5" fill="#D6F0ED" />
      <rect x="54" y="54" width="32" height="3" rx="1.5" fill="#D6F0ED" />
      <rect x="54" y="62" width="18" height="3" rx="1.5" fill="#D6F0ED" />

      {/* Big checkmark circle */}
      <circle cx="70" cy="70" r="14" fill="#0D7C6E" />
      <path
        d="M63 70 L68 75 L77 66"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Naira coin */}
      <circle cx="100" cy="82" r="12" fill="#D97706" />
      <circle cx="100" cy="82" r="9" fill="#F5C07A" />
      <text
        x="100"
        y="86"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#064E45"
        fontFamily="Inter, sans-serif"
      >
        ₦
      </text>

      {/* Decorative dots */}
      <circle cx="30" cy="44" r="3" fill="#D6F0ED" />
      <circle cx="110" cy="36" r="3" fill="#D6F0ED" />
      <circle cx="34" cy="74" r="2" fill="#D6F0ED" />
      <circle cx="114" cy="58" r="2" fill="#D6F0ED" />

      {/* Small sparkle */}
      <path d="M108 28 L110 32 L112 28 L110 24 Z" fill="#D6F0ED" />
      <path d="M28 60 L30 64 L32 60 L30 56 Z" fill="#D6F0ED" />
    </svg>
  )
}
