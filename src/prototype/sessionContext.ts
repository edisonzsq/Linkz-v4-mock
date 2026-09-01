import { createContext, useContext } from 'react'

/**
 * Two demo identities. User A signs in with Google SSO, User B with a mobile
 * OTP — the two login paths the design supports. Both belong to the same
 * company, which is why they see each other's data.
 */
export type UserId = 'sanders' | 'dheana'

export type DemoUser = {
  id: UserId
  name: string
  role: string
  email: string
  phone: string
  initials: string
  /** How this identity signs in, shown in the README and the profile screen. */
  signInMethod: string
}

export const demoUsers: Record<UserId, DemoUser> = {
  sanders: {
    id: 'sanders',
    name: 'Sanders',
    role: 'Business Owner',
    email: 'sanders@linkzasia.com',
    phone: '(+62)811-1509-265',
    initials: 'S',
    signInMethod: 'Google SSO',
  },
  dheana: {
    id: 'dheana',
    name: 'Dheana Titaura',
    role: 'Business Owner',
    email: 'dheana@linkzasia.com',
    phone: '(+62)812-3456-7890',
    initials: 'DT',
    signInMethod: 'Mobile OTP',
  },
}

/** Collections a user can add to during a session. */
export type Collection = 'addresses' | 'employees' | 'contacts' | 'products'

export type SharedRecord = {
  id: string
  addedBy: UserId
  addedAt: string
  /** The row itself — shape depends on the collection. */
  fields: Record<string, string | boolean>
}

export type SharedData = Record<Collection, SharedRecord[]>

export const emptyShared: SharedData = {
  addresses: [],
  employees: [],
  contacts: [],
  products: [],
}

export type SessionValue = {
  /** null until someone signs in. */
  user: DemoUser | null
  signIn: (id: UserId) => void
  signOut: () => void
  /** Records added during this session, shared by both users. */
  shared: SharedData
  add: (collection: Collection, fields: Record<string, string | boolean>) => void
  /** Clears the shared store — the reset button on the demo-data panel. */
  clearShared: () => void
}

export const SessionContext = createContext<SessionValue | null>(null)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}

/** Who added a row, for the "Added by" badge. Falls back gracefully. */
export function addedByName(id: UserId) {
  return demoUsers[id]?.name ?? id
}
