import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { GoogleIcon } from '../../components/ui/Icon'
import { useFlow } from '../../prototype/flowContext'
import { demoUsers, useSession } from '../../prototype/sessionContext'

/** Figma: "Google Auth - Choose Account" / "- Confirmation"
 *  (nodes 4001:78216, 4001:78300). Mocked — no Google request is made. */
export function GoogleAuth() {
  const { go, set, state } = useFlow()
  const { signIn } = useSession()
  const [step, setStep] = useState<'choose' | 'confirm'>('choose')

  const accounts = [
    { name: demoUsers.sanders.name, email: demoUsers.sanders.email, initials: demoUsers.sanders.initials },
    { name: 'Rina Halim', email: 'rina@sinarjaya.co.id', initials: 'RH' },
  ]
  const [picked, setPicked] = useState(accounts[0])

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-100 p-4">
      <div className="w-full max-w-[420px] rounded-s300 border border-neutral-200 bg-white p-8">
        <div className="flex flex-col items-center gap-s200 text-center">
          <GoogleIcon className="size-8" />
          <h1 className="text-lg font-bold text-text-primary">
            {step === 'choose' ? 'Choose an account' : 'Continue to LINKZ'}
          </h1>
          <p className="text-xs3 text-text-secondary">
            {step === 'choose' ? 'to continue to LINKZ' : `You are signing in as ${picked.email}`}
          </p>
        </div>

        {step === 'choose' ? (
          <div className="mt-6 flex flex-col">
            {accounts.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => {
                  setPicked(a)
                  setStep('confirm')
                }}
                className="flex items-center gap-s300 rounded-s200 border-b border-neutral-100 px-2 py-3 text-left last:border-0 hover:bg-neutral-50"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-400 text-xs3 font-bold text-white">
                  {a.initials}
                </span>
                <span>
                  <span className="block text-xs3 font-semibold text-text-primary">{a.name}</span>
                  <span className="block text-xs4 text-neutral-500">{a.email}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-s300">
            <p className="rounded-s200 bg-neutral-100 p-s300 text-xs3 text-text-secondary">
              LINKZ will get your name, email address and profile picture. Prototype only — nothing
              is shared with Google.
            </p>
            <div className="flex justify-end gap-s200">
              <Button variant="ghost" onClick={() => setStep('choose')}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  set({ email: picked.email, method: 'google' })
                  // Google SSO is User A's path.
                  signIn('sanders')
                  // Signing UP with Google still owes Basic Info — the SSO card
                  // (4001:77653) reads "account created -> Basic Info", and the
                  // AC makes it mandatory. Logging in skips it: an existing
                  // account already has one.
                  go(state.googleIntent === 'login' ? 'get-started' : 'account-created')
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => go('create-account')}
          className="mt-6 w-full text-center text-xs4 text-neutral-500 underline"
        >
          Back to LINKZ
        </button>
      </div>
    </div>
  )
}
