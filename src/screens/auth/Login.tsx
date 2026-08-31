import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { GoogleIcon, Icon } from '../../components/ui/Icon'
import { LanguagePicker, OtpInput, Tabs } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import { countries, createAccount, login as copy } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

type Method = 'phone' | 'email'

/** Figma: "Login with Phone" / "Login with Email" (nodes 4001:77661, 4001:77931)
 *  and their filled / code-sent / attempts-left variants. */
export function Login() {
  const { go } = useFlow()
  const [method, setMethod] = useState<Method>('phone')
  const [identifier, setIdentifier] = useState('')
  const [country, setCountry] = useState('id')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [attempts, setAttempts] = useState(3)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const valid =
    method === 'phone'
      ? identifier.replace(/\D/g, '').length >= 7
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)

  /** Mocked: 123456 logs in. Nothing is sent anywhere. */
  function verify() {
    if (code.replace(/\s/g, '') === '123456') {
      go('get-started')
      return
    }
    const left = attempts - 1
    setAttempts(left)
    setError(
      left > 0 ? `Incorrect code. ${copy.attemptsCopy(left)}.` : 'Too many attempts. Request a new code.',
    )
  }

  return (
    <AuthLayout
      header={
        <>
          <LanguagePicker />
          <div className="flex items-center gap-s200">
            <span className="hidden text-xs3 text-black sm:inline">{copy.noAccount}</span>
            <Button variant="outline" onClick={() => go('create-account')}>
              {copy.createAccount}
            </Button>
          </div>
        </>
      }
    >
      <div className="flex w-full max-w-[400px] flex-col gap-s400">
        <div className="flex flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">{copy.title}</h1>
          <p className="text-xs2 text-text-primary">{copy.subtitle}</p>
        </div>

        <Tabs
          value={method}
          onChange={(m) => {
            setMethod(m)
            setSent(false)
            setCode('')
            setError('')
            setIdentifier('')
            setAttempts(3)
          }}
          tabs={[
            { id: 'phone' as Method, label: 'Phone' },
            { id: 'email' as Method, label: 'Email' },
          ]}
        />

        {!sent ? (
          <div className="flex flex-col gap-s300">
            {method === 'phone' ? (
              <TextField
                name="login-phone"
                label="Phone Number"
                inputMode="tel"
                placeholder="811 1509 265"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.replace(/[^\d\s-]/g, ''))}
                leading={
                  <label className="flex cursor-pointer items-center gap-s100">
                    <span className="text-xs3">
                      {countries.find((c) => c.value === country)?.flag}
                    </span>
                    <span className="text-xs3 font-semibold">
                      {countries.find((c) => c.value === country)?.dial}
                    </span>
                    <select
                      aria-label="Country dialling code"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-4 appearance-none bg-transparent text-transparent outline-none"
                    >
                      {countries.map((c) => (
                        <option key={c.value} value={c.value} className="text-text-primary">
                          {c.label} {c.dial}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevron-down" className="-ml-4 size-4 text-neutral-500" />
                  </label>
                }
              />
            ) : (
              <TextField
                name="login-email"
                type="email"
                label="Email"
                placeholder="yourname@company.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            )}

            <Button className="w-full" disabled={!valid} onClick={() => setSent(true)}>
              {copy.sendCode}
            </Button>

            <div className="flex items-center gap-s200">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs4 text-neutral-400">or</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            <Button variant="outline" className="w-full" onClick={() => go('google-auth')}>
              <GoogleIcon className="size-4" />
              {createAccount.google}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-s300">
            <p className="text-xs3 text-text-secondary">
              Code sent to <span className="font-bold text-text-primary">{identifier}</span>
            </p>
            <OtpInput value={code} onChange={setCode} invalid={!!error} />
            {error && <p className="text-xs3 text-danger">{error}</p>}
            <Button className="w-full" onClick={verify} disabled={attempts <= 0}>
              {copy.submit}
            </Button>
            <div className="flex flex-wrap items-center gap-s200 text-xs3">
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
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Request code again'}
              </button>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="font-bold text-primary-400 underline"
              >
                Use a different {method}
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
