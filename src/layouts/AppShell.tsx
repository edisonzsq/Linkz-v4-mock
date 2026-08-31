import { useState, type ReactNode } from 'react'
import { Icon } from '../components/ui/Icon'
import { LanguagePicker } from '../components/ui/Misc'
import { Logo } from '../components/ui/Logo'
import { currentUser, sidebarFooter, sidebarNav } from '../data/mock'
import { useFlow } from '../prototype/flowContext'

/**
 * In-app shell used by the Get Started and KYC screens
 * (Figma: Sidebar 160px + TopNavBar 64px + optional Sub Sidemenu 232px —
 * nodes 4001:77356, 4001:84233).
 */
export function AppShell({
  children,
  subMenu,
  activeNav = 'home',
}: {
  children: ReactNode
  subMenu?: ReactNode
  activeNav?: string
}) {
  const { go } = useFlow()
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar — 160px in the design */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-40 flex-col border-r border-neutral-200 bg-white lg:static ${
          mobileNav ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="flex h-16 items-center px-4">
          <Logo className="scale-90 origin-left" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {sidebarNav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setMobileNav(false)}
              className={`flex items-center gap-s200 rounded-s200 px-2 py-2 text-xs3 font-medium transition-colors ${
                n.id === activeNav
                  ? 'bg-primary-50 text-primary-400'
                  : 'text-text-secondary hover:bg-neutral-100'
              }`}
            >
              <Icon name={n.icon} className="size-4" />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col gap-s200 border-t border-neutral-200 p-2">
          <div className="px-2 py-1">
            <p className="text-xs4 font-bold text-neutral-500">{sidebarFooter.supportLabel}</p>
            <a
              href={`mailto:${sidebarFooter.email}`}
              className="mt-0.5 block truncate text-xs4 text-text-secondary underline"
            >
              {sidebarFooter.email}
            </a>
            <a
              href={`tel:${sidebarFooter.phone}`}
              className="block truncate text-xs4 text-text-secondary underline"
            >
              {sidebarFooter.phone}
            </a>
          </div>

          <button
            type="button"
            onClick={() => go('login')}
            className="rounded-s200 px-2 py-2 text-left text-xs3 text-text-secondary hover:bg-neutral-100"
          >
            {sidebarFooter.logout}
          </button>

          <div className="flex items-center gap-s200 border-t border-neutral-200 px-2 pt-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-400 text-xs4 font-bold text-white">
              {currentUser.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs4 font-semibold text-text-primary">
                {currentUser.name}
              </span>
              <span className="block truncate text-xs4 text-neutral-500">{currentUser.role}</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* TopNavBar — 64px */}
        <header className="flex h-16 shrink-0 items-center gap-s300 border-b border-neutral-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Toggle navigation"
            className="grid size-8 place-items-center rounded-s200 border border-neutral-300 lg:hidden"
          >
            <Icon name="menu" className="size-4" />
          </button>

          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="ml-auto flex items-center gap-s300">
            <LanguagePicker />
          </div>
        </header>

        <div className="flex min-w-0 flex-1">
          {subMenu && (
            <div className="hidden w-[232px] shrink-0 border-r border-neutral-200 bg-white p-4 xl:block">
              {subMenu}
            </div>
          )}
          <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>

      {mobileNav && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-neutral-900/30 lg:hidden"
        />
      )}
    </div>
  )
}
