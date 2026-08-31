import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { LanguagePicker, OtpInput } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import { createAccount, otpScreen as copy } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/** Figma: "Phone Email Onboarding 2 - OTP Email / OTP Phone"
 *  (nodes 4001:76466, 4001:77314) plus the error-empty variants. */
export function Otp({ channel }: { channel: 'email' | 'phone' }) {
  const { go, state } = useFlow()
  const [code, setCode] = useState('')
  const [attempts, setAttempts] = useState(3)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const target = channel === 'email' ? state.email || 'you@company.com' : state.phone || '+62 811 1509 265'

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  /** Mocked: 123456 is the "correct" code. Nothing is sent anywhere. */
  function verify() {
    if (code.replace(/\s/g, '').length < 6) {
      setError('Enter all 6 digits')
      return
    }
    if (code.replace(/\s/g, '') === '123456') {
      go('basic-info')
      return
    }
    const left = attempts - 1
    setAttempts(left)
    setError(
      left > 0
        ? `That code is not right. ${left} attempt${left === 1 ? '' : 's'} left.`
        : 'Too many attempts. Request a new code.',
    )
  }

  return (
    <AuthLayout
      header={
        <>
          <LanguagePicker />
          <div className="flex items-center gap-s200">
            <span className="hidden text-xs3 text-black sm:inline">{createAccount.haveAccount}</span>
            <Button variant="outline" onClick={() => go('login')}>
              {createAccount.login}
            </Button>
          </div>
        </>
      }
    >
      <div className="flex w-full max-w-[424px] flex-col gap-s400">
        <div className="flex flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">
            {channel === 'email' ? copy.title : copy.titlePhone}
          </h1>
          <p className="text-xs2 text-text-primary">
            {copy.sentTo} <span className="font-bold">{target}</span>
          </p>
        </div>

        <OtpInput value={code} onChange={setCode} invalid={!!error} />

        {error && <p className="text-xs3 text-danger">{error}</p>}

        <p className="rounded-s200 bg-neutral-100 px-s200 py-1.5 text-xs4 text-text-secondary">
          Prototype: enter <span className="font-bold">123456</span> to continue. No code is sent.
        </p>

        <Button className="w-full" onClick={verify} disabled={attempts <= 0}>
          {copy.verify}
        </Button>

        <div className="flex flex-col gap-s200">
          <div className="flex flex-wrap items-center gap-s200 text-xs3">
            <span className="text-text-secondary">{copy.codePrompt}</span>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => {
                setCooldown(30)
                setAttempts(3)
                setError('')
              }}
              className="font-bold text-primary-400 underline disabled:text-neutral-400 disabled:no-underline"
            >
              {cooldown > 0 ? `Request again in ${cooldown}s` : copy.resend}
            </button>
            <span className="text-xs4 text-neutral-500">{attempts} left</span>
          </div>
          <div className="flex flex-wrap items-center gap-s200 text-xs3">
            <span className="text-text-secondary">
              {channel === 'email' ? copy.changeEmail : copy.changePhone}
            </span>
            <button
              type="button"
              onClick={() => go('create-account')}
              className="font-bold text-primary-400 underline"
            >
              {channel === 'email' ? copy.changeEmailAction : copy.changePhoneAction}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
