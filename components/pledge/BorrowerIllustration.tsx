/**
 * Borrower step illustration – two people connecting with a verified badge.
 * Matches the "Let's add the borrower" illustration from the design mockup.
 */
export function BorrowerIllustration() {
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
      <circle cx="70" cy="54" r="46" fill="#EBF7F6" />

      {/* Left person – lender */}
      <circle cx="46" cy="40" r="14" fill="#0D7C6E" />
      <circle cx="46" cy="40" r="10" fill="#F5C07A" />
      {/* Face */}
      <circle cx="43" cy="38" r="1.5" fill="#064E45" />
      <circle cx="49" cy="38" r="1.5" fill="#064E45" />
      <path d="M43 43 Q46 46 49 43" stroke="#064E45" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M36 36 Q36 28 46 28 Q56 28 56 36" fill="#3D2C1E" />

      {/* Right person – borrower */}
      <circle cx="94" cy="40" r="14" fill="#0D7C6E" />
      <circle cx="94" cy="40" r="10" fill="#8B6B4A" />
      {/* Face */}
      <circle cx="91" cy="38" r="1.5" fill="#064E45" />
      <circle cx="97" cy="38" r="1.5" fill="#064E45" />
      <path d="M91 43 Q94 46 97 43" stroke="#064E45" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M84 36 Q84 26 94 26 Q104 26 104 36" fill="#1A1A2E" />

      {/* Connection line / handshake */}
      <path
        d="M58 52 Q70 62 82 52"
        stroke="#0D7C6E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
      />

      {/* Verified badge */}
      <circle cx="70" cy="72" r="12" fill="#0D7C6E" />
      <path
        d="M64 72 L68 76 L76 68"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small decorative dots */}
      <circle cx="30" cy="70" r="3" fill="#D6F0ED" />
      <circle cx="110" cy="70" r="3" fill="#D6F0ED" />
      <circle cx="24" cy="50" r="2" fill="#D6F0ED" />
      <circle cx="116" cy="50" r="2" fill="#D6F0ED" />

      {/* Phone icon on left person */}
      <rect x="36" y="56" width="8" height="12" rx="2" fill="#064E45" opacity="0.3" />
      <rect x="37.5" y="58" width="5" height="6" rx="1" fill="#0D7C6E" opacity="0.5" />
    </svg>
  )
}
