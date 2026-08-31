/**
 * LINKZ wordmark.
 *
 * PLACEHOLDER: the real logo is an exported SVG in the Figma file
 * (node 4001:76332, 67.31 × 32). This environment could not download Figma
 * assets, so the mark is reconstructed from the design screenshot. It keeps the
 * designed 67.31 × 32 box so layout matches; drop in the real export when
 * available (see README → "Assets").
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 67.31 32"
      className={className}
      role="img"
      aria-label="LINKZ"
      style={{ width: 67.31, height: 32 }}
    >
      <text
        x="0"
        y="22.5"
        fill="#101828"
        fontFamily="'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif"
        fontSize="21"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        LINKZ
      </text>
      <path
        d="M24 25.5c4.6 4.2 12.2 4.2 16.8 0"
        fill="none"
        stroke="#499873"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
