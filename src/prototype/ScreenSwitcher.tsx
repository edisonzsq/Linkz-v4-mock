import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { useFlow } from './flowContext'
import { demoUsers, useSession, type UserId } from './sessionContext'
import { screens } from './screens'

const groups = [...new Set(screens.map((s) => s.group))]

/**
 * Prototype-only helper: jump straight to any screen without walking the flow.
 * Not part of the Figma design.
 */
export function ScreenSwitcher() {
  const { screen, go } = useFlow()
  const { user, signIn, signOut, shared, clearShared } = useSession()
  const [open, setOpen] = useState(false)
  const current = screens.find((s) => s.id === screen)
  const added = Object.values(shared).reduce((n, list) => n + list.length, 0)

  return (
    <div className="fixed right-4 bottom-4 z-[60] print:hidden">
      {open && (
        <div className="mb-2 ml-auto max-h-[70vh] w-64 overflow-auto rounded-s300 border border-neutral-200 bg-white p-2 shadow-[0_16px_40px_-12px_rgba(16,24,40,.3)]">
          <div className="mb-2 rounded-s200 bg-primary-50 p-2">
            <p className="text-xs4 font-bold text-primary-600">Demo credentials</p>
            <p className="mt-0.5 text-xs4 leading-[14px] text-text-secondary">
              Any OTP code is <span className="font-bold">123456</span>. Forms validate locally;
              nothing is sent anywhere.
            </p>
          </div>

          {/* Switch identity without re-walking the login flow. */}
          <div className="mb-2 rounded-s200 border border-neutral-200 p-2">
            <p className="text-xs4 font-bold text-neutral-500">Signed in as</p>
            <div className="mt-1 flex gap-1">
              {(Object.keys(demoUsers) as UserId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => signIn(id)}
                  className={`flex-1 rounded-s200 px-2 py-1 text-xs4 font-semibold ${
                    user?.id === id
                      ? 'bg-primary-400 text-white'
                      : 'bg-neutral-100 text-text-secondary hover:bg-neutral-200'
                  }`}
                >
                  {demoUsers[id].name.split(' ')[0]}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs4 leading-[14px] text-text-secondary">
              {user ? `${user.signInMethod} · both users share one data set` : 'Signed out'}
            </p>
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                onClick={signOut}
                className="flex-1 rounded-s200 px-2 py-1 text-xs4 text-text-secondary hover:bg-neutral-100"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={clearShared}
                className="flex-1 rounded-s200 px-2 py-1 text-xs4 text-text-secondary hover:bg-neutral-100"
              >
                Reset data ({added})
              </button>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g} className="mb-2 last:mb-0">
              <p className="px-2 py-1 text-xs4 font-bold tracking-wide text-neutral-400 uppercase">
                {g}
              </p>
              {screens
                .filter((s) => s.group === g)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      go(s.id)
                      setOpen(false)
                    }}
                    className={`block w-full rounded-s200 px-2 py-1.5 text-left text-xs3 ${
                      s.id === screen
                        ? 'bg-primary-50 font-semibold text-primary-400'
                        : 'text-text-secondary hover:bg-neutral-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-s200 rounded-full bg-neutral-900 py-2 pr-3 pl-3 text-xs3 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(16,24,40,.6)]"
      >
        <Icon name="menu" className="size-4" />
        {current?.label ?? 'Screens'}
        <Icon name={open ? 'chevron-down' : 'chevron-up'} className="size-4 opacity-70" />
      </button>
    </div>
  )
}
