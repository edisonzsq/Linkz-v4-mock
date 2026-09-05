import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { FlowContext, type FlowValue } from './flowContext'
import { readHash, type ScreenId, type SignupState } from './screens'

const blankSignup: SignupState = {
  phone: '',
  email: '',
  country: 'id',
  method: 'phone',
  googleIntent: 'signup',
  kycMode: 'onboarding',
  editingSku: '',
  viewingOrder: '',
  businessType: '',
  twoFactorOn: false,
  completedTasks: [],
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>(readHash)
  const [state, setState] = useState<SignupState>(blankSignup)

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
      reset: () => setState(blankSignup),
      completeTask: (id) =>
        setState((prev) =>
          prev.completedTasks.includes(id)
            ? prev
            : { ...prev, completedTasks: [...prev.completedTasks, id] },
        ),
    }),
    [screen, state],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}
