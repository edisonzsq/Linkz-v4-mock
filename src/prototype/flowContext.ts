import { createContext, useContext } from 'react'
import type { ScreenId, SignupState } from './screens'

export type FlowValue = {
  screen: ScreenId
  go: (s: ScreenId) => void
  state: SignupState
  set: (patch: Partial<SignupState>) => void
}

export const FlowContext = createContext<FlowValue | null>(null)

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used inside FlowProvider')
  return ctx
}
