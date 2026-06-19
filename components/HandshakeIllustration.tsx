export function HandshakeIllustration() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="100" r="92" className="fill-primary-50" />
      <circle cx="100" cy="100" r="88" className="stroke-primary-100" strokeWidth="1.5" />

      <path
        d="M 24 175 C 52 140, 68 110, 84 82"
        className="stroke-primary"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 176 175 C 148 140, 132 110, 116 82"
        className="stroke-primary"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 80 76 C 76 54, 96 44, 114 50 C 124 54, 128 62, 124 74"
        className="stroke-primary"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 120 76 C 124 54, 104 44, 86 50 C 76 54, 72 62, 76 74"
        className="stroke-primary"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 86 66 C 82 52, 72 44, 60 46"
        className="stroke-primary"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 114 66 C 118 52, 128 44, 140 46"
        className="stroke-primary"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  )
}
