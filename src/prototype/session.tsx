import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Order } from '../state/orders'
import {
  demoUsers,
  emptyShared,
  SessionContext,
  type Collection,
  type PopupId,
  type SessionValue,
  type SharedData,
  type UserId,
} from './sessionContext'

const USER_KEY = 'linkz-v4-demo-user'
const DATA_KEY = 'linkz-v4-shared-data'
const SEEN_KEY = 'linkz-v4-seen-popups'

/**
 * Mocked multi-user session.
 *
 * Two identities sign in through the two paths the design supports — Google SSO
 * and mobile OTP — and both read and write **one** store, so a row added by one
 * user is visible to the other. That store lives in `localStorage`, which is
 * what makes it survive the sign-out / sign-in round trip a demo needs. It is
 * still entirely local: nothing is sent anywhere, and a different browser or a
 * private window starts empty.
 *
 * Storage access is wrapped because it throws outright in some embedded and
 * privacy-restricted contexts; the prototype degrades to in-memory state there
 * rather than failing to render.
 */
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — session stays in memory for this tab */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<UserId | null>(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY)
      return raw === 'sanders' || raw === 'dheana' ? raw : null
    } catch {
      return null
    }
  })

  const [shared, setShared] = useState<SharedData>(() => readJson(DATA_KEY, emptyShared))
  const [pendingPopups, setPendingPopups] = useState<PopupId[]>([])
  const [seen, setSeen] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem(SEEN_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    writeJson(SEEN_KEY, seen)
  }, [seen])

  useEffect(() => {
    try {
      if (userId) window.localStorage.setItem(USER_KEY, userId)
      else window.localStorage.removeItem(USER_KEY)
    } catch {
      /* ignore */
    }
  }, [userId])

  useEffect(() => {
    writeJson(DATA_KEY, shared)
  }, [shared])

  // Keep two tabs in step, so the same browser can show both users at once.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === DATA_KEY) setShared(readJson(DATA_KEY, emptyShared))
      if (e.key === USER_KEY) {
        const v = e.newValue
        setUserId(v === 'sanders' || v === 'dheana' ? v : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback(
    (collection: Collection, fields: Record<string, string | boolean>) => {
      setShared((prev) => ({
        ...prev,
        [collection]: [
          {
            id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            addedBy: userId ?? 'sanders',
            addedAt: new Date().toISOString(),
            fields,
          },
          ...prev[collection],
        ],
      }))
    },
    [userId],
  )

  const addOrder = useCallback((order: Order) => {
    setShared((prev) => ({ ...prev, orders: [order, ...prev.orders] }))
  }, [])

  const updateOrder = useCallback((no: string, mutate: (order: Order) => void) => {
    setShared((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.no !== no) return o
        // The transitions in `state/orders.ts` mutate; give them a copy so React
        // still sees a new object and re-renders.
        const next = structuredClone(o)
        mutate(next)
        return next
      }),
    }))
  }, [])

  // "Seen" is tracked per identity, so each user gets their own first entry.
  const seenKey = useCallback((id: PopupId) => `${userId ?? 'anon'}:${id}`, [userId])

  const value = useMemo<SessionValue>(
    () => ({
      user: userId ? demoUsers[userId] : null,
      signIn: setUserId,
      signOut: () => setUserId(null),
      shared,
      add,
      addOrder,
      updateOrder,
      clearShared: () => {
        setShared(emptyShared)
        setSeen([])
      },
      pendingPopups,
      notify: (id) => setPendingPopups((q) => (q.includes(id) ? q : [...q, id])),
      dismissPopup: () => setPendingPopups((q) => q.slice(1)),
      hasSeen: (id) => seen.includes(seenKey(id)),
      markSeen: (id) =>
        setSeen((prev) => (prev.includes(seenKey(id)) ? prev : [...prev, seenKey(id)])),
    }),
    [userId, shared, add, addOrder, updateOrder, pendingPopups, seen, seenKey],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
