import type { ReactNode } from 'react'

export type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

/** Maps the status vocabulary used across the order, finance and KYC tables. */
export function statusTone(status: string): Tone {
  switch (status) {
    case 'Paid':
    case 'Completed':
    case 'Approved':
    case 'Verified':
    case 'Active':
    case 'Repaid':
    case 'Qualified':
    case 'Linked':
      return 'success'
    case 'Pending':
    case 'Processing':
    case 'Overpaid':
    case 'Under Review':
    case 'Invited':
    case 'Outstanding':
      return 'warning'
    case 'Cancelled':
    case 'Rejected':
    case 'Overdue':
      return 'danger'
    case 'Confirmed':
    case 'Invoiced':
    case 'Charge Back':
      return 'info'
    case 'Void':
      return 'neutral'
    default:
      return 'neutral'
  }
}

/**
 * Collects a row's cells. DataTable wraps each one in a keyed `<td>`, so the
 * cells never render as a bare array — going through this helper instead of an
 * array literal keeps that clear to both readers and the `jsx-key` lint rule.
 */
export function cells(...items: ReactNode[]): ReactNode[] {
  return items
}
