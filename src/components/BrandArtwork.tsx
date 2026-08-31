/**
 * Left-panel artwork.
 *
 * The concentric dashed rings are reproduced from the Figma "Background Image"
 * frame (node 4001:76339) at their designed diameters and opacities.
 *
 * The photograph that sits on top of them in Figma
 * ("hand-climbing-wooden-blocks-represent-growth", node 4001:76347) is an
 * exported raster asset this environment could not download, so the block-and-arrow
 * illustration below stands in for it at the same position and scale. Drop the real
 * export into src/assets/ and swap <BlockIllustration/> for an <img> to match the
 * design exactly. See README → "Assets".
 */

const rings = [
  { size: 796.25, opacity: 0.4 },
  { size: 653.333, opacity: 0.5 },
  { size: 510.417, opacity: 0.7 },
  { size: 367.5, opacity: 0.8 },
  { size: 224.583, opacity: 1 },
]

function BlockIllustration() {
  return (
    <svg viewBox="0 0 340 250" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6cfa8" />
          <stop offset="100%" stopColor="#c9a877" />
        </linearGradient>
        <linearGradient id="wood2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0dfc0" />
          <stop offset="100%" stopColor="#d8ba8c" />
        </linearGradient>
      </defs>
      {/* stacked blocks, ascending */}
      <rect x="20" y="170" width="66" height="66" rx="5" fill="url(#wood)" />
      <rect x="92" y="132" width="66" height="104" rx="5" fill="url(#wood2)" />
      <rect x="164" y="94" width="66" height="142" rx="5" fill="url(#wood)" />
      <rect x="236" y="56" width="66" height="180" rx="5" fill="url(#wood2)" />
      {/* growth arrow */}
      <path
        d="M196 214V116"
        stroke="#499873"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M196 86l26 38h-52z" fill="#499873" />
    </svg>
  )
}

export function BrandArtwork() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-[-100px] w-[539px] overflow-hidden">
      <div className="absolute top-1/2 left-0 h-[796.25px] w-[404.25px] -translate-y-1/2">
        {rings.map((r) => (
          <div
            key={r.size}
            style={{ width: r.size, height: r.size, opacity: r.opacity }}
            className="absolute top-1/2 left-[calc(50%+196px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neutral-400/60"
          />
        ))}
      </div>
      <div className="absolute top-[150px] left-[10px] h-[300px] w-[400px]">
        <BlockIllustration />
      </div>
    </div>
  )
}
