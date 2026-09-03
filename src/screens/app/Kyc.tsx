import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { Alert, OtpInput } from '../../components/ui/Misc'
import { AppShell } from '../../layouts/AppShell'
import { KycField, KycLayout, UploadBox } from '../../layouts/KycLayout'
import { banks, currentUser, kycBank, kycSubmitted, legal, twoFactor } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'
import { useSession } from '../../prototype/sessionContext'

/**
 * Figma: "Phone Email KYC - Bank Account Details" (4001:84939).
 *
 * NOTE: the shell, navigation and section label are taken from the design, but
 * this screen's field copy has not been read from Figma yet — see README →
 * "Fidelity notes" for which screens are still placeholder copy.
 */
export function KycBankAccount() {
  const { go, completeTask } = useFlow()
  const { notify } = useSession()
  const [form, setForm] = useState({ bank: '', accountNumber: '', accountName: '' })
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit =
    form.bank !== '' && form.accountNumber.trim() !== '' && form.accountName.trim() !== ''

  return (
    <KycLayout
      active="bank"
      sectionLabel={kycBank.sectionLabel}
      title={kycBank.title}
      continueLabel={kycBank.submit}
      continueDisabled={!canSubmit}
      onContinue={() => {
        // Step 1 of Get Started is "Verify Your Business" — submitting KYC is
        // what completes it. Without this it navigated but never ticked over.
        completeTask('kyc')
        notify('kyc-complete')
        go('kyc-submitted')
      }}
      secondaryLabel={kycBank.back}
      onSecondary={() => go('kyc-business')}
    >
      <p className="text-xs3 text-text-secondary">{kycBank.intro}</p>

      {/* Consent notice — shown above the fields in the frame. */}
      <div className="flex w-full max-w-[816px] items-start gap-s200 rounded-s200 bg-neutral-100 p-s300">
        <Icon name="shield" className="mt-px size-4 shrink-0 text-text-secondary" />
        <p className="text-xs4 text-text-secondary">
          {kycBank.consent.prefix}
          <span className="font-bold text-text-primary">{kycBank.consent.action}</span>
          {kycBank.consent.body}
          <a href={legal.terms} className="text-primary-500 underline">
            {kycBank.consent.terms}
          </a>
          {kycBank.consent.and}
          <a href={legal.privacy} className="text-primary-500 underline">
            {kycBank.consent.privacy}
          </a>
          {kycBank.consent.suffix}
        </p>
      </div>

      <KycField
        label={kycBank.fields.bankName.label}
        hint={kycBank.fields.bankName.hint}
      >
        <SelectField
          name="bank"
          placeholder="Select your bank"
          options={banks}
          value={form.bank}
          onChange={upd('bank')}
        />
      </KycField>

      <KycField
        label={kycBank.fields.accountNumber.label}
        hint={kycBank.fields.accountNumber.hint}
      >
        <TextField
          name="accountNumber"
          inputMode="numeric"
          placeholder={kycBank.fields.accountNumber.placeholder}
          value={form.accountNumber}
          onChange={(e) =>
            setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))
          }
        />
      </KycField>

      <KycField
        label={kycBank.fields.accountName.label}
        hint={kycBank.fields.accountName.hint}
      >
        <TextField
          name="accountName"
          placeholder={kycBank.fields.accountName.placeholder}
          value={form.accountName}
          onChange={upd('accountName')}
        />
      </KycField>

      <div className="h-px w-full max-w-[816px] border-t border-neutral-200" />

      <div className="flex w-full max-w-[816px] items-start gap-s200 rounded-s200 bg-neutral-100 p-s300">
        <Icon name="info" className="mt-px size-4 shrink-0 text-text-secondary" />
        <p className="text-xs4 text-text-secondary">
          {kycBank.uploadNote.prefix}
          <span className="font-bold text-text-primary">{kycBank.uploadNote.formats}</span>
          {kycBank.uploadNote.middle}
          <span className="font-bold text-text-primary">{kycBank.uploadNote.size}</span>
          {kycBank.uploadNote.suffix}
        </p>
      </div>

      <KycField
        label={kycBank.fields.statement.label}
        hint={kycBank.fields.statement.hint}
      >
        <UploadBox label="Bank statement" />
      </KycField>
    </KycLayout>
  )
}

/**
 * Figma: "Phone KYC - 2FA" (4001:85492) and its OTP / verified variants.
 * Sits under "After KYC" in the verification sub-menu.
 *
 * NOTE: field copy not yet read from Figma — see README → "Fidelity notes".
 */
export function KycTwoFactor() {
  const { go, state, set, completeTask } = useFlow()
  const { notify } = useSession()
  const [stage, setStage] = useState<'intro' | 'otp' | 'done'>('intro')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function verify(next: string) {
    if (next.replace(/\s/g, '').length < 6) return
    if (next.replace(/\s/g, '') === '123456') {
      set({ twoFactorOn: true })
      setStage('done')
      setError('')
    } else {
      setError('That code is not correct.')
    }
  }

  return (
    <KycLayout
      active="2fa"
      sectionLabel="After KYC"
      title={twoFactor.title}
      continueLabel={stage === 'done' ? 'Finish' : 'Send code'}
      continueDisabled={stage === 'otp'}
      onContinue={() => {
        if (stage !== 'done') return setStage('otp')
        completeTask('2fa')
        notify('two-factor-complete')
        go('kyc-submitted')
      }}
    >
      <p className="text-xs3 text-text-secondary">{twoFactor.subtitle}</p>

      {stage === 'intro' && (
        <div className="flex w-full max-w-[816px] flex-col items-start gap-s300 rounded-s200 bg-neutral-100 p-s300">
          <p className="text-xs3 font-bold text-text-primary">{twoFactor.howItWorks}</p>
          <ol className="flex flex-col gap-s200">
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
      )}

      {stage === 'otp' && (
        <KycField label="Verification code" hint={`Sent to ${state.email || currentUser.email}`}>
          <div className="flex w-full flex-col gap-s200">
            <OtpInput
              autoFocus
              value={code}
              invalid={!!error}
              onChange={(v) => {
                setCode(v)
                setError('')
                verify(v)
              }}
            />
            {error && <p className="text-xs3 text-danger">{error}</p>}
          </div>
        </KycField>
      )}

      {stage === 'done' && (
        <Alert tone="success" className="w-full max-w-[816px]">
          <span className="font-bold">{twoFactor.verified}.</span> {twoFactor.verifiedSub}
        </Alert>
      )}
    </KycLayout>
  )
}

/** Figma: "SSO KYC Submitted" (4001:77400). NOTE: copy not yet read from Figma. */
export function KycSubmitted() {
  const { go, state } = useFlow()
  const { notify } = useSession()
  return (
    <AppShell activeNav="get-started">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-s300 rounded-s300 border border-neutral-200 bg-white px-8 py-14 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-primary-25">
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
        <Button
          className="mt-2 w-[220px]"
          onClick={() => {
            notify('kyc-complete')
            go('get-started')
          }}
        >
          {kycSubmitted.cta}
        </Button>
      </div>
    </AppShell>
  )
}
