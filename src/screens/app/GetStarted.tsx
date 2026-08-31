import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Modal } from '../../components/ui/Misc'
import { AppShell } from '../../layouts/AppShell'
import { currentUser, getStarted, welcomeModal } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/** Figma: "Phone Email Get Started" (node 4001:77356) — dashboard with a
 *  progress header, four task cards and the welcome modal on top. */
export function GetStarted() {
  const { go, state, set } = useFlow()
  const [welcome, setWelcome] = useState(true)

  const done = state.completedTasks
  const pct = Math.round((done.length / getStarted.tasks.length) * 100)

  function openTask(id: string) {
    if (id === 'kyc') return go('kyc-business')
    if (id === 'bank') return go('kyc-bank')
    // Catalogue and invite are out of scope for this prototype — mark them done.
    set({ completedTasks: [...new Set([...done, id])] })
  }

  return (
    <AppShell activeNav="home">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-s400">
        {/* Progress header */}
        <div className="flex flex-col items-start gap-s400 rounded-s300 border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center">
          <span className="grid size-20 shrink-0 place-items-center rounded-s300 bg-primary-50">
            <Icon name="file-check" className="size-9 text-primary-400" strokeWidth={1.3} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-text-primary">{getStarted.title}</h1>
            <p className="mt-1 text-xs2 text-text-secondary">{getStarted.subtitle}</p>
          </div>
          <div className="w-full sm:w-[264px]">
            <div className="flex items-center justify-between text-xs3">
              <span className="font-semibold text-text-primary">
                {done.length} of {getStarted.tasks.length} done
              </span>
              <span className="text-neutral-500">{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-primary-400 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task cards */}
        <div className="grid gap-s300 sm:grid-cols-2 xl:grid-cols-4">
          {getStarted.tasks.map((t) => {
            const isDone = done.includes(t.id)
            return (
              <article
                key={t.id}
                className="flex flex-col rounded-s300 border border-neutral-200 bg-white p-5"
              >
                <span
                  className={`grid size-10 place-items-center rounded-s200 ${
                    isDone ? 'bg-success-bg text-success' : 'bg-primary-50 text-primary-400'
                  }`}
                >
                  <Icon name={isDone ? 'check' : t.icon} className="size-5" />
                </span>
                <h2 className="mt-4 text-xs2 font-bold text-text-primary">{t.title}</h2>
                <p className="mt-1 flex-1 text-xs3 text-text-secondary">{t.description}</p>
                {isDone ? (
                  <span className="mt-4 inline-flex items-center gap-s100 text-xs3 font-semibold text-success">
                    <Icon name="check" className="size-4" />
                    Completed
                  </span>
                ) : (
                  <Button variant="outline" className="mt-4 w-full" onClick={() => openTask(t.id)}>
                    {t.cta}
                  </Button>
                )}
              </article>
            )
          })}
        </div>
      </div>

      <Modal open={welcome} onClose={() => setWelcome(false)}>
        <div className="h-[200px] bg-primary-50">
          <svg viewBox="0 0 500 200" className="h-full w-full" aria-hidden="true">
            <circle cx="250" cy="120" r="95" fill="#d6e8df" />
            <circle cx="250" cy="120" r="62" fill="#499873" opacity=".18" />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={92 + i * 12}
                y={60 + i * 6}
                width="7"
                height="7"
                rx="1.5"
                fill="#499873"
                opacity=".4"
              />
            ))}
            {[0, 1, 2].map((i) => (
              <rect key={i} x={370} y={70 + i * 14} width="42" height="6" rx="3" fill="#75b096" />
            ))}
            <path
              d="M215 122l24 24 47-52"
              fill="none"
              stroke="#499873"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-s200 px-10 py-8 text-center">
          <h2 className="text-xl font-bold text-text-primary">{welcomeModal.title}</h2>
          <p className="text-xs2 text-text-secondary">{welcomeModal.subtitle}</p>
          <p className="text-xs3 text-neutral-500">
            Signed in as <span className="font-bold text-text-primary">{currentUser.email}</span>
          </p>
          <Button className="mt-2 w-[160px]" onClick={() => setWelcome(false)}>
            {welcomeModal.cta}
          </Button>
        </div>
      </Modal>
    </AppShell>
  )
}
