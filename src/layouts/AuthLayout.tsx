import type { ReactNode } from 'react'
import { BrandArtwork } from '../components/BrandArtwork'
import { Logo } from '../components/ui/Logo'
import { support, tagline } from '../data/mock'

/**
 * The split-screen shell shared by every sign-up screen
 * (Figma nodes 4001:76309 and siblings): a 281px brand column on the left over
 * the ring artwork, and a white 16px-radius card on the right.
 */
export function AuthLayout({
  children,
  header,
}: {
  children: ReactNode
  /** Contents of the card's top-right corner (language picker + login/signup CTA). */
  header?: ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-neutral-100">
      {/* ---- Left brand column (desktop only, mirrors the mobile frames which drop it) ---- */}
      <div className="absolute top-1/2 left-[100px] hidden h-[829px] w-[281px] -translate-y-1/2 lg:block">
        <BrandArtwork />
        <div className="absolute top-[35px] left-0">
          <Logo />
        </div>
        <p className="text-shadow-tagline absolute top-[538px] left-0 w-[281px] text-xl font-bold text-text-primary">
          {tagline}
        </p>
        <div className="absolute top-[733px] left-0 flex w-[175px] flex-col gap-s100">
          <p className="py-s100 text-xs3 font-bold text-neutral-500">{support.prompt}</p>
          <a href={`mailto:${support.email}`} className="text-xs2 font-bold text-text-primary underline">
            {support.email}
          </a>
          <a href={`tel:${support.phone}`} className="text-xs2 font-bold text-text-primary underline">
            {support.phone}
          </a>
        </div>
      </div>

      {/* ---- Right card ---- */}
      <div className="relative min-h-screen px-4 py-6 lg:absolute lg:inset-y-0 lg:right-4 lg:left-[calc(25%+43px)] lg:flex lg:items-center lg:px-0 lg:py-0">
        <div className="relative flex min-h-[calc(100vh-3rem)] w-full flex-col rounded-s300 border border-neutral-200 bg-white lg:h-[829px] lg:min-h-0">
          <div className="flex items-center justify-end gap-s400 px-6 pt-6 lg:absolute lg:top-[41px] lg:right-[40px] lg:px-0 lg:pt-0">
            {header}
          </div>
          {/* Logo shows inside the card on small screens, where the brand column is hidden */}
          <div className="px-6 pt-4 lg:hidden">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-center px-6 py-8 lg:px-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
