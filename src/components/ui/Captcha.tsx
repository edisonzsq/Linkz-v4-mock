/**
 * Cloudflare Turnstile widget as drawn in the Figma frames
 * (component 4001:8145 — "Success!" state, 65px tall, #fafafa on a 1px #e0e0e0
 * border, square corners, Open Sans label).
 *
 * Purely decorative in this prototype — no challenge runs. The Cloudflare mark is
 * redrawn inline because Figma asset exports are unreachable from the build
 * environment (see README → "Assets").
 */
export function Captcha({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative h-[65px] w-full border border-[#e0e0e0] bg-[#fafafa] ${className}`}
      aria-label="Verification: success"
    >
      {/* Checkbox — 24px at left 15 */}
      <svg
        viewBox="0 0 24 24"
        className="absolute top-1/2 left-[15px] size-6 -translate-y-1/2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="11" fill="#4a9c5d" />
        <path
          d="m6.5 12.3 3.6 3.6 7.2-7.6"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p
        className="absolute top-1/2 left-[51px] -translate-y-1/2 text-[14px] text-[#1d1f20]"
        style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
      >
        Success!
      </p>

      {/* Cloudflare mark — 75 × 25 at right 15, cloud above the wordmark */}
      <svg
        viewBox="0 0 75 25"
        className="absolute top-[calc(50%-6px)] right-[15px] h-[25px] w-[75px] -translate-y-1/2"
        aria-hidden="true"
      >
        <g transform="translate(46 0)">
          <path
            d="M20.4 12.2H7.6a3.5 3.5 0 0 1 .5-6.9c.3 0 .5 0 .8.1a5.1 5.1 0 0 1 9.7-1.4 3 3 0 0 1 4.2 2.7 3 3 0 0 1-2.4 5.5Z"
            fill="#f6821f"
            transform="scale(0.62)"
          />
          <path d="M14.6 7.6a1.7 1.7 0 0 0 .6-2.4l-.8.2a2 2 0 0 1-1 2.2Z" fill="#fbad41" />
        </g>
        <text
          x="0"
          y="22"
          fill="#404041"
          fontFamily="'Open Sans', system-ui, sans-serif"
          fontSize="8.4"
          fontWeight="700"
          letterSpacing="0.6"
        >
          CLOUDFLARE
        </text>
      </svg>

      <p
        className="absolute top-[calc(50%+8.5px)] right-[15px] text-right text-[8px] text-black"
        style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
      >
        Privacy&nbsp;&nbsp;•&nbsp;&nbsp;Terms
      </p>
    </div>
  )
}
