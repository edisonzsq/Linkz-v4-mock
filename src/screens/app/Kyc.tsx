import { useState, type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { Checkbox, RadioCard, SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { Alert, OtpInput, Stepper } from '../../components/ui/Misc'
import { AppShell } from '../../layouts/AppShell'
import {
  banks,
  businessTypes,
  countries,
  currentUser,
  industries,
  kycSteps,
  kycSubmitted,
  monthlyRevenue,
  twoFactor,
} from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

function KycPage({
  step,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = 'Save and continue',
  nextDisabled,
}: {
  step: number
  title: string
  description: string
  children: ReactNode
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <AppShell
      activeNav="home"
      subMenu={
        <div className="flex flex-col gap-s400">
          <p className="text-xs4 font-bold tracking-wide text-neutral-400 uppercase">Verification</p>
          <Stepper steps={kycSteps} current={step} />
        </div>
      }
    >
      <div className="mx-auto flex max-w-[1208px] flex-col gap-s400">
        <div className="flex flex-wrap items-start justify-between gap-s300">
          <div>
            <h1 className="text-lg font-bold text-text-primary">{title}</h1>
            <p className="mt-1 max-w-[560px] text-xs2 text-text-secondary">{description}</p>
          </div>
          <span className="rounded-full bg-warning-bg px-3 py-1 text-xs3 font-semibold text-warning">
            Step {step + 1} of {kycSteps.length}
          </span>
        </div>

        <div className="rounded-s300 border border-neutral-200 bg-white p-6">{children}</div>

        <div className="flex items-center justify-between gap-s300">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              <Icon name="arrow-left" className="size-4" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button className="w-full sm:w-[254px]" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

/** Figma: "KYC - Business Overview - Personal / Established" (nodes 4001:84233, 4001:84868). */
export function KycBusinessOverview() {
  const { go, state, set } = useFlow()
  const [type, setType] = useState(state.businessType || 'personal')
  const [form, setForm] = useState({
    legalName: '',
    tradingName: '',
    registrationNo: '',
    industry: '',
    otherIndustry: '',
    revenue: '',
    country: 'id',
    address: '',
  })
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const established = type === 'established'
  const canNext = form.legalName.trim() !== '' && form.industry !== '' && form.address.trim() !== ''

  return (
    <KycPage
      step={0}
      title="Business overview"
      description="Tell us about the business behind the account. We verify these details before enabling financing."
      onNext={() => {
        set({ businessType: type })
        go('kyc-bank')
      }}
      nextDisabled={!canNext}
    >
      <div className="flex flex-col gap-s400">
        <div>
          <p className="text-xs3 font-bold text-text-primary">Business type</p>
          <div className="mt-s200 flex flex-col gap-s200 sm:flex-row">
            {businessTypes.map((b) => (
              <RadioCard
                key={b.value}
                label={b.label}
                description={b.description}
                selected={type === b.value}
                onSelect={() => setType(b.value)}
              />
            ))}
          </div>
        </div>

        {established && (
          <Alert tone="info">
            Registered businesses need an NPWP and a business licence number. You can upload the
            documents after submitting this form.
          </Alert>
        )}

        <div className="grid gap-s300 lg:grid-cols-2">
          <TextField
            name="legalName"
            label={established ? 'Registered legal name' : 'Full name'}
            required
            placeholder={established ? 'PT Sinar Jaya Trading' : currentUser.name}
            value={form.legalName}
            onChange={upd('legalName')}
          />
          <TextField
            name="tradingName"
            label="Trading name"
            placeholder="The name your buyers know"
            value={form.tradingName}
            onChange={upd('tradingName')}
          />
          {established && (
            <TextField
              name="registrationNo"
              label="Business registration / NPWP"
              required
              placeholder="00.000.000.0-000.000"
              value={form.registrationNo}
              onChange={upd('registrationNo')}
            />
          )}
          <SelectField
            name="industry"
            label="Industry"
            required
            placeholder="Select an industry"
            options={industries}
            value={form.industry}
            onChange={upd('industry')}
          />
          {form.industry === 'other' && (
            <TextField
              name="otherIndustry"
              label="Please specify"
              required
              placeholder="Describe what you trade"
              value={form.otherIndustry}
              onChange={upd('otherIndustry')}
            />
          )}
          <SelectField
            name="revenue"
            label="Average monthly revenue"
            placeholder="Select a range"
            options={monthlyRevenue}
            value={form.revenue}
            onChange={upd('revenue')}
            help="Used to size your financing limit. An estimate is fine."
          />
          <SelectField
            name="country"
            label="Country of operation"
            required
            options={countries.map((c) => ({ value: c.value, label: c.label }))}
            value={form.country}
            onChange={upd('country')}
          />
          <TextField
            name="address"
            label="Business address"
            required
            placeholder="Street, district, city, postcode"
            value={form.address}
            onChange={upd('address')}
            containerClassName="lg:col-span-2"
          />
        </div>

        <div className="flex items-center gap-s300 rounded-s200 border border-dashed border-neutral-300 p-s300">
          <Icon name="upload" className="size-5 shrink-0 text-neutral-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs3 font-semibold text-text-primary">
              Upload {established ? 'business licence / NPWP' : 'a photo of your ID'}
            </p>
            <p className="text-xs4 text-neutral-500">PDF, JPG or PNG up to 10 MB — mocked, no upload happens.</p>
          </div>
          <Button variant="ghost">Choose file</Button>
        </div>
      </div>
    </KycPage>
  )
}

/** Figma: "KYC - Bank Account Details" (nodes 4001:84939, 4001:85408). */
export function KycBankAccount() {
  const { go } = useFlow()
  const [form, setForm] = useState({ bank: '', accountName: '', accountNumber: '', branch: '' })
  const [confirmed, setConfirmed] = useState(false)
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const canNext =
    form.bank !== '' &&
    form.accountName.trim() !== '' &&
    form.accountNumber.replace(/\D/g, '').length >= 8 &&
    confirmed

  return (
    <KycPage
      step={1}
      title="Bank account details"
      description="Where settlements and financing disbursements land. The account must be in the business's name."
      onBack={() => go('kyc-business')}
      onNext={() => go('kyc-2fa')}
      nextDisabled={!canNext}
    >
      <div className="flex flex-col gap-s400">
        <div className="grid gap-s300 lg:grid-cols-2">
          <SelectField
            name="bank"
            label="Bank"
            required
            placeholder="Select your bank"
            options={banks}
            value={form.bank}
            onChange={upd('bank')}
          />
          <TextField
            name="branch"
            label="Branch"
            placeholder="e.g. Jakarta Kota"
            value={form.branch}
            onChange={upd('branch')}
          />
          <TextField
            name="accountName"
            label="Account holder name"
            required
            placeholder="Exactly as printed on the bank statement"
            value={form.accountName}
            onChange={upd('accountName')}
          />
          <TextField
            name="accountNumber"
            label="Account number"
            required
            inputMode="numeric"
            placeholder="0000000000"
            value={form.accountNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))
            }
            help="8–16 digits, no spaces."
          />
        </div>

        <Alert tone="warning">
          A mismatch between the account name and your registered business name is the most common
          reason verification is delayed.
        </Alert>

        <Checkbox
          id="confirm-bank"
          checked={confirmed}
          onChange={setConfirmed}
          label="I confirm this account belongs to the business named on this application."
        />
      </div>
    </KycPage>
  )
}

/** Figma: "KYC - 2FA", "2FA OTP", "2FA Email Verified", "2FA Verified"
 *  (nodes 4001:85492, 4001:85916, 4001:87212, 4001:87636). */
export function KycTwoFactor() {
  const { go, state, set } = useFlow()
  const [stage, setStage] = useState<'intro' | 'otp' | 'done'>('intro')
  const [channel, setChannel] = useState<'email' | 'phone'>('email')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function verify() {
    if (code.replace(/\s/g, '') === '123456') {
      set({ twoFactorOn: true })
      setStage('done')
      setError('')
    } else {
      setError('That code is not right. Try 123456 in this prototype.')
    }
  }

  return (
    <KycPage
      step={2}
      title={twoFactor.title}
      description={twoFactor.subtitle}
      onBack={() => go('kyc-bank')}
      onNext={() => (stage === 'done' ? go('kyc-submitted') : setStage('otp'))}
      nextLabel={stage === 'done' ? 'Submit application' : 'Send code'}
      nextDisabled={stage === 'otp'}
    >
      <div className="flex flex-col gap-s400">
        {stage === 'intro' && (
          <>
            <div className="flex flex-col gap-s200 sm:flex-row">
              <RadioCard
                label="Email"
                description={state.email || currentUser.email}
                selected={channel === 'email'}
                onSelect={() => setChannel('email')}
              />
              <RadioCard
                label="Phone"
                description={state.phone || '+62 811 1509 265'}
                selected={channel === 'phone'}
                onSelect={() => setChannel('phone')}
              />
            </div>

            <div className="rounded-s200 bg-neutral-100 p-s300">
              <p className="text-xs3 font-bold text-text-primary">{twoFactor.howItWorks}</p>
              <ol className="mt-s200 flex flex-col gap-s200">
                {twoFactor.steps.map((s, i) => (
                  <li key={s} className="flex gap-s200 text-xs3 text-text-secondary">
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary-400 text-[9px] font-bold text-white">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {stage === 'otp' && (
          <div className="flex max-w-[424px] flex-col gap-s300">
            <p className="text-xs3 text-text-secondary">
              Code sent to{' '}
              <span className="font-bold text-text-primary">
                {channel === 'email' ? state.email || currentUser.email : state.phone || '+62 811 1509 265'}
              </span>
            </p>
            <OtpInput value={code} onChange={setCode} invalid={!!error} />
            {error && <p className="text-xs3 text-danger">{error}</p>}
            <div className="flex gap-s200">
              <Button onClick={verify}>Verify</Button>
              <Button variant="ghost" onClick={() => setStage('intro')}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {stage === 'done' && (
          <Alert tone="success">
            <span className="font-bold">{twoFactor.verified}.</span> {twoFactor.verifiedSub}
          </Alert>
        )}
      </div>
    </KycPage>
  )
}

/** Figma: "SSO KYC Submitted" (node 4001:77400). */
export function KycSubmitted() {
  const { go, state } = useFlow()
  return (
    <AppShell activeNav="home">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-s300 rounded-s300 border border-neutral-200 bg-white px-8 py-14 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-primary-50">
          <Icon name="file-check" className="size-8 text-primary-400" strokeWidth={1.3} />
        </span>
        <h1 className="text-xl font-bold text-text-primary">{kycSubmitted.title}</h1>
        <p className="text-xs2 text-text-secondary">
          {kycSubmitted.subtitle}{' '}
          <span className="font-bold text-text-primary">{state.email || currentUser.email}</span>.
        </p>
        <Alert tone="info" className="w-full text-left">
          {kycSubmitted.meanwhile}
        </Alert>
        <Button className="mt-2 w-[220px]" onClick={() => go('get-started')}>
          {kycSubmitted.cta}
        </Button>
      </div>
    </AppShell>
  )
}
