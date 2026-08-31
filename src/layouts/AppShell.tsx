import { useState, type ReactNode } from 'react'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { currentUser, sidebarNav } from '../data/mock'
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
        <button
          type="button"
          onClick={() => go('login')}
          className="m-2 rounded-s200 px-2 py-2 text-left text-xs3 text-neutral-500 hover:bg-neutral-100"
        >
          Sign out
        </button>
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

          <div className="hidden min-w-0 flex-1 items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 py-1.5 sm:flex sm:max-w-[320px]">
            <Icon name="search" className="size-4 text-neutral-400" />
            <input
              placeholder="Search orders, products, partners"
              className="min-w-0 flex-1 bg-transparent text-xs3 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-s300">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-8 place-items-center rounded-full hover:bg-neutral-100"
            >
              <Icon name="bell" className="size-4 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger" />
            </button>
            <div className="flex items-center gap-s200">
              <span className="grid size-8 place-items-center rounded-full bg-primary-400 text-xs4 font-bold text-white">
                {currentUser.initials}
              </span>
              <span className="hidden sm:block">
                <span className="block text-xs3 font-semibold text-text-primary">
                  {currentUser.name}
                </span>
                <span className="block text-xs4 text-neutral-500">{currentUser.company}</span>
              </span>
            </div>
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
