import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { FlowContext, type FlowValue } from './flowContext'
import { readHash, type ScreenId, type SignupState } from './screens'

export function FlowProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>(readHash)
  const [state, setState] = useState<SignupState>({
    phone: '',
    email: '',
    country: 'id',
    method: 'phone',
    businessType: '',
    twoFactorOn: false,
    completedTasks: [],
  })

  useEffect(() => {
    const onHash = () => setScreen(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const value = useMemo<FlowValue>(
    () => ({
      screen,
      go: (s: ScreenId) => {
        window.location.hash = `/${s}`
        setScreen(s)
        window.scrollTo({ top: 0 })
      },
      state,
      set: (patch) => setState((prev) => ({ ...prev, ...patch })),
    }),
    [screen, state],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}
