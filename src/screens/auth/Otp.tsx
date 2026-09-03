import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Captcha } from '../../components/ui/Captcha'
import { LanguagePicker, OtpInput } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import { createAccount, otpScreen as copy } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/**
 * Figma: "Phone Email Onboarding 2 - OTP Email" (4001:76466) and
 * "- OTP Phone" (4001:77314).
 *
 * The design has no submit button — the form advances once six digits are entered.
 * Layout: 424px column, 45px gaps between title block / digits / captcha / code info.
 */
export function Otp({ channel }: { channel: 'email' | 'phone' }) {
  const { go, state } = useFlow()
  const [code, setCode] = useState('')
  const [resendsLeft, setResendsLeft] = useState(5)
  const [error, setError] = useState('')

  const target =
    channel === 'email'
      ? state.email || copy.sampleEmail
      : state.phone || copy.samplePhone

  /** Mocked: 123456 is the accepted code. Nothing is sent anywhere. */
  function submit(next: string) {
    if (next.replace(/\s/g, '').length < 6) return
    if (next.replace(/\s/g, '') === '123456') {
      setError('')
      // Account is created at this point — Basic Info greets you with the popup.
      go('account-created')
    } else {
      setError('That code is not correct. Check the code and try again.')
    }
  }

  return (
    <AuthLayout
      nudge={{ x: -15, y: 0.5 }}
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
      <div className="flex w-full max-w-[424px] flex-col items-center gap-[45px]">
        <div className="flex w-full flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">{copy.title}</h1>
          <p className="flex flex-wrap gap-s100 text-xs2 text-text-primary">
            <span>{channel === 'email' ? copy.sentToEmail : copy.sentToPhone}</span>
            <span className="font-bold">{target}</span>
          </p>
        </div>

        <div className="flex w-full items-center justify-center">
          <OtpInput
            autoFocus
            value={code}
            invalid={!!error}
            onChange={(v) => {
              setCode(v)
              setError('')
              submit(v)
            }}
          />
        </div>

        <Captcha />

        <div className="flex w-full flex-col gap-s300">
          {error && <p className="text-center text-xs3 text-danger">{error}</p>}

          <div className="flex flex-wrap items-center justify-center gap-s100">
            <p className="text-center text-xs3 text-text-primary">{copy.codePrompt}</p>
            <button
              type="button"
              disabled={resendsLeft === 0}
              onClick={() => {
                setResendsLeft((n) => Math.max(0, n - 1))
                setCode('')
                setError('')
              }}
              className="text-xs2 font-bold text-primary-400 underline disabled:text-neutral-400 disabled:no-underline"
            >
              {copy.resend}
            </button>
            <p className="text-center text-xs3 text-neutral-500">{copy.resendLeft(resendsLeft)}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-s100">
            <p className="text-center text-xs3 text-text-primary">
              {channel === 'email' ? copy.wrongEmail : copy.wrongPhone}
            </p>
            <button
              type="button"
              onClick={() => go('create-account')}
              className="text-xs2 font-bold text-primary-400 underline"
            >
              {channel === 'email' ? copy.changeEmail : copy.changePhone}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
