import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { GoogleIcon, Icon } from '../../components/ui/Icon'
import { LanguagePicker } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import { countries, createAccount as copy, legal } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/** Figma: "Phone Email Onboarding 1 - Create Account" (node 4001:76309) and its
 *  filled / error-empty variants (4001:76348, 4001:76388, 4001:76427). */
export function CreateAccount() {
  const { go, state, set } = useFlow()
  const [phone, setPhone] = useState(state.phone)
  const [email, setEmail] = useState(state.email)
  const [country, setCountry] = useState(state.country)
  const [touched, setTouched] = useState(false)

  const dial = countries.find((c) => c.value === country)?.dial ?? '+62'
  const phoneError = touched && !phone.trim() ? 'Phone number is required' : ''
  const emailError = touched
    ? !email.trim()
      ? 'Email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Enter a valid email address'
        : ''
    : ''
  const canSubmit = phone.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  function submit() {
    setTouched(true)
    if (!canSubmit) return
    set({ phone: `${dial} ${phone}`, email, country, method: 'email' })
    go('otp-email')
  }

  return (
    <AuthLayout
      header={
        <>
          <LanguagePicker />
          <div className="flex items-center gap-s200">
            <span className="hidden text-xs3 text-black sm:inline">{copy.haveAccount}</span>
            <Button variant="outline" onClick={() => go('login')}>
              {copy.login}
            </Button>
          </div>
        </>
      }
    >
      <div className="flex w-full max-w-[377px] flex-col gap-[45px]">
        <div className="flex flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">{copy.title}</h1>
          <p className="text-xs2 text-text-primary">{copy.subtitle}</p>
        </div>

        <div className="flex flex-col gap-s200">
          <TextField
            name="phone"
            label={copy.phoneLabel}
            inputMode="tel"
            placeholder={copy.phonePlaceholder}
            value={phone}
            error={phoneError}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
            leading={
              <label className="flex cursor-pointer items-center gap-s100">
                <span className="text-xs3">{countries.find((c) => c.value === country)?.flag}</span>
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

          <TextField
            name="email"
            type="email"
            label={copy.emailLabel}
            placeholder={copy.emailPlaceholder}
            value={email}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-s300 py-s400">
            <Button className="w-full" disabled={!canSubmit} onClick={submit}>
              {copy.submit}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
                set({ googleIntent: 'signup' })
                go('google-auth')
              }}>
              <GoogleIcon className="size-4" />
              {copy.google}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs3 text-text-secondary">
          By signing up, you agree to the{' '}
          <a href={legal.terms} target="_blank" rel="noreferrer" className="underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={legal.privacy} target="_blank" rel="noreferrer" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </AuthLayout>
  )
}
