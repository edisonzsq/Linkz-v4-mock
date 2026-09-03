import { createContext, useContext } from 'react'
import type { ScreenId, SignupState } from './screens'

export type FlowValue = {
  screen: ScreenId
  go: (s: ScreenId) => void
  state: SignupState
  set: (patch: Partial<SignupState>) => void
  /** Wipes the sign-up state — "Start Over" must not leave the old email behind. */
  reset: () => void
  /**
   * Marks a Get Started task done, idempotently. Finishing KYC has to reach the
   * Get Started card somehow; before this, step 1 navigated but never completed.
   */
  completeTask: (id: string) => void
}

export const FlowContext = createContext<FlowValue | null>(null)

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used inside FlowProvider')
  return ctx
}
