import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConfettiCheck, SuccessPopup } from '../../components/ui/SuccessPopup'
import { AppShell } from '../../layouts/AppShell'
import {
  currentUser,
  getStarted as copy,
  moreFromLinkz,
  successPopups,
} from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'
import { useSession, type PopupId } from '../../prototype/sessionContext'
import type { ScreenId } from '../../prototype/screens'

/**
 * Figma: "Phone Email Get Started" (4001:77356) — dashboard header with the
 * 142px illustration, progress bar (264 × 12) and four 510.4 × 236 task cards,
 * with the welcome modal (4001:77356 → "Account Created Pop Up") on top.
 */
export function GetStarted({ forcePopup }: { forcePopup?: PopupId } = {}) {
  const { go, state, set, completeTask } = useFlow()
  const { pendingPopups, dismissPopup, hasSeen, markSeen } = useSession()

  /**
   * Which success popup to show, in priority order:
   *   1. one forced by a demo route (so each is directly viewable),
   *   2. one queued by something that just happened (KYC / 2FA),
   *   3. the first-entry welcome, which fires once per user whatever path they
   *      took in — skipped KYC, KYC without 2FA, or both.
   */
  const popupId: PopupId | null =
    forcePopup ?? pendingPopups[0] ?? (hasSeen('welcome') ? null : 'welcome')
  const popup = popupId ? successPopups[popupId] : null

  /**
   * Track *which* popup was dismissed rather than a bare boolean. React reuses
   * this component instance when only the `forcePopup` prop changes, so a plain
   * flag would leak across popups and suppress the next one.
   */
  const [dismissedId, setDismissedId] = useState<PopupId | null>(null)
  const popupOpen = popupId !== null && dismissedId !== popupId

  function closePopup() {
    if (popupId === 'welcome') markSeen('welcome')
    if (!forcePopup) dismissPopup()
    setDismissedId(popupId)
  }

  const done = state.completedTasks
  const total = copy.tasks.length
  const pct = done.length / total

  function openTask(id: string) {
    // KYC is completed by submitting it, not by opening it — see `completeTask`
    // in `Kyc.tsx`. The others have no screen of their own in this mock, so
    // opening them is what marks them done.
    if (id === 'kyc') {
      set({ kycMode: 'post-login' })
      return go('kyc-business')
    }
    if (id === 'order') return go('order-new')
    if (id === 'team') return go('employees')
    completeTask(id)
  }

  return (
    <AppShell activeNav="get-started">
      <div className="flex flex-col gap-s200">
        {/* Header: illustration + info + progress */}
        <div className="flex flex-col items-start justify-center gap-s500 px-s500 py-s400 lg:flex-row lg:items-end">
          <DashboardIllustration />

          <div className="flex min-w-0 flex-1 flex-col items-start justify-between gap-s400 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-s300 text-text-primary">
              <p className="text-xs3">{copy.greeting(currentUser.greetingName)}</p>
              <p className="text-lg font-bold">{copy.title}</p>
              <p className="text-xs3">
                {copy.subtitleLine1}
                <br />
                {copy.subtitleLine2}
              </p>
            </div>

            <div className="flex flex-col items-end gap-s200">
              <p className="text-xs2 font-bold text-text-secondary">
                {copy.progress(done.length, total)}
              </p>
              <div className="flex h-3 w-[264px] flex-col items-start rounded-s500 bg-neutral-200">
                <div
                  className="h-3 rounded-s500 bg-primary-400 transition-[width] duration-500"
                  style={{ width: pct === 0 ? 15 : `${Math.max(pct * 100, 6)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task cards — horizontally scrollable, matching the 4-across row */}
        <div className="flex gap-[10px] overflow-x-auto px-s500 pb-2">
          {copy.tasks.map((t, i) => {
            const isDone = done.includes(t.id)
            return (
              <article
                key={t.id}
                className="flex h-[236px] w-[510.4px] shrink-0 flex-col overflow-hidden rounded-s300 border border-neutral-200"
              >
                <div className="flex min-h-px flex-1 flex-col items-start gap-s200 bg-white p-s300">
                  <div className="flex w-full items-center justify-between">
                    <span className="flex w-9 flex-col items-center justify-center rounded-full bg-primary-25 p-s200 text-center text-xs2 font-semibold text-black">
                      {i + 1}
                    </span>
                    <span
                      className={`flex items-center justify-center gap-s100 overflow-hidden rounded-[4px] px-1.5 py-0.5 text-center text-xs3 font-semibold ${
                        isDone ? 'bg-success-bg text-success' : 'bg-neutral-50 text-text-secondary'
                      }`}
                    >
                      {isDone ? copy.completed : copy.notStarted}
                    </span>
                  </div>

                  <div className="flex w-full flex-col items-start gap-s200">
                    <p className="w-full text-xs font-bold text-[#101828]">{t.title}</p>
                    <p className="w-full text-[12px] leading-[16px] text-[#171a1c]">
                      {t.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openTask(t.id)}
                  className="flex w-full items-center justify-between bg-[#f9fafb] px-s300 py-s200 text-left"
                >
                  <span className="flex h-10 items-center justify-center gap-s200 rounded-s200 py-2.5 text-xs2 font-semibold text-primary-400">
                    {t.cta}
                  </span>
                  <Icon name="chevron-right" className="size-6 text-text-secondary" />
                </button>
              </article>
            )
          })}
        </div>

        {/* Figma 4029:45150 — "More from LINKZ", below the steps. */}
        <section className="flex flex-col gap-s300 px-s500 pt-s400 pb-s500">
          <h2 className="text-xs font-bold text-text-primary">{moreFromLinkz.title}</h2>
          <div className="grid grid-cols-1 gap-s300 lg:grid-cols-2">
            {moreFromLinkz.cards.map((c) => (
              <article
                key={c.id}
                className="flex flex-col items-start gap-s200 rounded-s300 border border-neutral-200 bg-white p-s300"
              >
                <span className="grid size-8 place-items-center rounded-s200 bg-primary-25 text-primary-400">
                  <Icon name={c.icon} className="size-4" />
                </span>
                <p className="text-xs2 font-bold text-text-primary">{c.title}</p>
                <p className="text-xs3 text-text-secondary">{c.body}</p>
                <Button
                  variant="outline"
                  className="mt-s100"
                  onClick={() => c.target && go(c.target as ScreenId)}
                >
                  {c.cta}
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>

      {popup && (
        <SuccessPopup
          open={popupOpen}
          onClose={closePopup}
          title={popup.title}
          body={popup.body}
          art={popup.art === 'welcome' ? <WelcomeArt /> : <ConfettiCheck />}
          artFirst={popup.art === 'welcome'}
        />
      )}
    </AppShell>
  )
}

/**
 * PLACEHOLDER for the 142 × 142 "Dashboard Card Icons" export (4001:77361).
 * Figma asset downloads are blocked in this environment — see README → "Assets".
 */
function DashboardIllustration() {
  return (
    <svg viewBox="0 0 142 142" className="size-[142px] shrink-0" aria-hidden="true">
      <rect x="14" y="26" width="88" height="66" rx="8" fill="#f1f8f4" stroke="#c9e3d5" />
      <rect x="26" y="42" width="46" height="6" rx="3" fill="#75b096" />
      <rect x="26" y="56" width="64" height="6" rx="3" fill="#d6e8df" />
      <rect x="26" y="70" width="34" height="6" rx="3" fill="#d6e8df" />
      <circle cx="104" cy="92" r="30" fill="#499873" />
      <path
        d="m92 92 8 8 20-20"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** PLACEHOLDER for the modal's "Welcome Image" (circle + stripes + confetti). */
function WelcomeArt() {
  return (
    <div className="h-[200px] bg-primary-25">
      <svg viewBox="0 0 500 200" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="118" r="86" fill="#d6e8df" />
        <circle cx="250" cy="118" r="56" fill="#499873" opacity=".16" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={96 + i * 13}
            y={54 + i * 7}
            width="7"
            height="7"
            rx="1.5"
            fill="#499873"
            opacity={0.5 - i * 0.06}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={372} y={66 + i * 15} width="44" height="6" rx="3" fill="#75b096" />
        ))}
        <path
          d="m216 120 24 24 46-52"
          fill="none"
          stroke="#499873"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
