import { useState, type ReactNode } from 'react'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { appNav, appSubNav, topBar } from '../data/appData'
import { currentUser, sidebarFooter } from '../data/mock'
import { useFlow } from '../prototype/flowContext'
import type { ScreenId } from '../prototype/screens'

/**
 * Console chrome for the in-app areas — 160px sidebar, 56px top bar.
 * From Figma node 4001:113931 (page "1. Dashboard"); the same Sidebar and
 * Desktop Top Bar instances appear on every frame across the four areas.
 *
 * The onboarding/KYC screens keep their own `AppShell`; this shell is for the
 * dashboard, order, catalogue, finance and manage areas.
 */
export function ConsoleShell({
  breadcrumb,
  back,
  children,
  activeNav,
}: {
  /** Trail shown in the top bar, e.g. ['Finance', 'Seller Pay Later']. */
  breadcrumb: string[]
  /** Shows the "Back" affordance the deeper frames carry. */
  back?: ScreenId
  children: ReactNode
  activeNav: string
}) {
  const { go } = useFlow()
  const [mobileNav, setMobileNav] = useState(false)
  const [open, setOpen] = useState<string | null>(() => {
    const group = Object.keys(appSubNav).find((g) =>
      appSubNav[g].some((s) => s.id === activeNav),
    )
    return group ?? null
  })

  function navigate(id: string) {
    setMobileNav(false)
    go(id as ScreenId)
  }

  const groupOf = Object.keys(appSubNav).find((g) =>
    appSubNav[g].some((s) => s.id === activeNav),
  )

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-40 shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white lg:static lg:flex ${
          mobileNav ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center px-4">
          <Logo className="origin-left scale-90" />
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {appNav.map((n) => {
            const active = n.id === activeNav || n.id === groupOf
            const expanded = open === n.id
            return (
              <div key={n.id}>
                <button
                  type="button"
                  onClick={() =>
                    n.expandable ? setOpen(expanded ? null : n.id) : navigate(n.id)
                  }
                  aria-expanded={n.expandable ? expanded : undefined}
                  className={`flex w-full items-center gap-s200 rounded-s200 px-2 py-2 text-xs3 font-medium transition-colors ${
                    active
                      ? 'bg-primary-25 font-semibold text-primary-400'
                      : 'text-text-secondary hover:bg-neutral-100'
                  }`}
                >
                  <Icon name={n.icon} className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{n.label}</span>
                  {n.expandable && (
                    <Icon
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      className="size-3.5 shrink-0"
                    />
                  )}
                </button>

                {n.expandable && expanded && (
                  <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
                    {appSubNav[n.id].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => navigate(s.id)}
                        className={`rounded-s200 py-1.5 pr-2 pl-8 text-left text-xs3 transition-colors ${
                          s.id === activeNav
                            ? 'font-semibold text-primary-400'
                            : 'text-text-secondary hover:bg-neutral-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-s200 p-2">
          <div className="px-2 py-1">
            <p className="text-xs3 font-semibold text-text-primary">
              {sidebarFooter.supportLabel}
            </p>
            <a
              href={`mailto:${sidebarFooter.email}`}
              className="mt-0.5 block truncate text-xs4 text-text-secondary"
            >
              {sidebarFooter.email}
            </a>
            <a
              href={`tel:${sidebarFooter.phone}`}
              className="block truncate text-xs4 text-text-secondary"
            >
              {sidebarFooter.phone}
            </a>
          </div>

          <button
            type="button"
            onClick={() => go('login')}
            className="flex items-center gap-s200 rounded-s200 px-2 py-2 text-left text-xs3 text-text-secondary hover:bg-neutral-100"
          >
            <Icon name="lock-keyhole" className="size-4" />
            {sidebarFooter.logout}
          </button>

          <div className="flex items-center gap-s200 border-t border-neutral-200 px-2 pt-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-100 text-xs4 font-bold text-primary-600">
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
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-s300 border-b border-neutral-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Toggle navigation"
            className="grid size-8 shrink-0 place-items-center rounded-s200 border border-neutral-300 lg:hidden"
          >
            <Icon name="menu" className="size-4" />
          </button>

          {back && (
            <button
              type="button"
              onClick={() => go(back)}
              className="flex shrink-0 items-center gap-s100 text-xs3 font-semibold text-text-primary hover:text-primary-400"
            >
              <Icon name="arrow-left" className="size-4" />
              {topBar.back}
            </button>
          )}

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-s200">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex min-w-0 items-center gap-s200">
                {i > 0 && <span className="text-neutral-300">/</span>}
                <span
                  className={`truncate text-xs3 ${
                    i === breadcrumb.length - 1
                      ? 'font-semibold text-text-primary'
                      : 'text-neutral-500'
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-s200">
            {/* Get Started progress — from Figma, node 4001:113931 */}
            <div className="hidden items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 py-1.5 xl:flex">
              <span className="text-xs3 text-text-secondary">{topBar.getStartedLabel}</span>
              <span className="h-1 w-10 overflow-hidden rounded-full bg-neutral-200">
                <span className="block h-full w-1/3 rounded-full bg-primary-400" />
              </span>
              <span className="text-xs3 font-semibold text-text-primary">
                {topBar.getStartedProgress}
              </span>
              <Icon name="chevron-down" className="size-3.5 text-neutral-500" />
            </div>

            <div className="hidden items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 py-1.5 md:flex">
              <span className="hidden text-xs3 text-text-secondary lg:inline">
                {topBar.companyLabel}
              </span>
              <span className="grid h-3 w-4 shrink-0 grid-rows-2 overflow-hidden rounded-[2px]">
                <span className="bg-[#e03030]" />
                <span className="bg-white" />
              </span>
              <span className="max-w-[140px] truncate text-xs3 font-semibold text-text-primary">
                {topBar.company}
              </span>
              <Icon name="circle-check" className="size-3.5 shrink-0 text-primary-400" />
              <Icon name="chevron-down" className="size-3.5 shrink-0 text-neutral-500" />
            </div>

            <div className="flex items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 py-1.5">
              <Icon name="globe" className="size-4 text-text-secondary" />
              <span className="hidden text-xs3 text-text-secondary sm:inline">
                {topBar.language}
              </span>
              <Icon name="chevron-down" className="size-3.5 text-neutral-500" />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4">{children}</main>
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
