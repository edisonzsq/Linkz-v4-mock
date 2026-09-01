import { Card } from '../../components/app/Console'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import { common } from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'

/**
 * Placeholder for sidebar destinations that exist in the Figma file but sit
 * outside the happy path built for training (Order Report, My Catalogue,
 * Shared with me). Without this, those nav items would navigate to an
 * unregistered hash and fall back to the sign-up screen mid-demo.
 */
export function NotBuilt({ title, activeNav }: { title: string; activeNav: string }) {
  const { go } = useFlow()
  return (
    <ConsoleShell breadcrumb={[title]} activeNav={activeNav}>
      <Card className="mx-auto max-w-[520px] text-center">
        <span className="mx-auto mb-s300 grid size-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
          <Icon name="info" className="size-6" />
        </span>
        <h2 className="text-md font-bold text-text-primary">{common.notBuiltTitle}</h2>
        <p className="mt-s200 text-xs3 text-text-secondary">{common.notBuiltBody}</p>
        <div className="mt-s400">
          <Button onClick={() => go('dashboard')}>Back to Dashboard</Button>
        </div>
      </Card>
    </ConsoleShell>
  )
}
