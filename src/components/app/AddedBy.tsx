import { addedByName, type UserId } from '../../prototype/sessionContext'

/**
 * Marks a row that was added during this demo session, and by whom. This is the
 * visible proof that the two users share one store: a row User A creates shows
 * "Added by Sanders" when User B signs in and looks at the same list.
 */
export function AddedBy({ by }: { by: UserId }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-primary-25 px-s200 py-0.5 text-xs4 font-semibold whitespace-nowrap text-primary-500">
      Added by {addedByName(by)}
    </span>
  )
}
