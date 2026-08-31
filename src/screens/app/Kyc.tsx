import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Checkbox, SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { Alert, OtpInput } from '../../components/ui/Misc'
import { AppShell } from '../../layouts/AppShell'
import { KycField, KycLayout } from '../../layouts/KycLayout'
import { banks, currentUser, kycSubmitted, twoFactor } from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/**
 * Figma: "Phone Email KYC - Bank Account Details" (4001:84939).
 *
 * NOTE: the shell, navigation and section label are taken from the design, but
 * this screen's field copy has not been read from Figma yet — see README →
 * "Fidelity notes" for which screens are still placeholder copy.
 */
export function KycBankAccount() {
  const { go } = useFlow()
  const [form, setForm] = useState({ bank: '', accountName: '', accountNumber: '', branch: '' })
  const [confirmed, setConfirmed] = useState(false)
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const canContinue =
    form.bank !== '' &&
    form.accountName.trim() !== '' &&
    form.accountNumber.replace(/\D/g, '').length >= 8 &&
    confirmed

  return (
    <KycLayout
      active="bank"
      sectionLabel="KYC Section 2 of 2"
      title="Bank Account Details"
      continueDisabled={!canContinue}
      onContinue={() => go('kyc-2fa')}
    >
      <p className="text-xs3 text-text-secondary">
        Where settlements and financing disbursements land. The account must be in the business’s
        name.
      </p>

      <KycField label="Bank" hint="The bank holding your business account.">
        <SelectField
          name="bank"
          placeholder="Select your bank"
          options={banks}
          value={form.bank}
          onChange={upd('bank')}
        />
      </KycField>

      <KycField label="Branch" hint="Optional — the branch your account was opened at.">
        <TextField
          name="branch"
          placeholder="e.g. Jakarta Kota"
          value={form.branch}
          onChange={upd('branch')}
        />
      </KycField>

      <KycField label="Account holder name" hint="Exactly as printed on the bank statement.">
        <TextField
          name="accountName"
          placeholder="Type in the account holder name"
          value={form.accountName}
          onChange={upd('accountName')}
        />
      </KycField>

      <KycField label="Account number" hint="8–16 digits, no spaces.">
        <TextField
          name="accountNumber"
          inputMode="numeric"
          placeholder="0000000000"
          value={form.accountNumber}
          onChange={(e) =>
            setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))
          }
        />
      </KycField>

      <div className="h-px w-full border-t border-neutral-200" />

      <Alert tone="warning" className="w-full max-w-[816px]">
        A mismatch between the account name and your registered business name is the most common
        reason verification is delayed.
      </Alert>

      <Checkbox
        id="confirm-bank"
        checked={confirmed}
        onChange={setConfirmed}
        label="I confirm this account belongs to the business named on this application."
      />
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
  const { go, state, set } = useFlow()
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
      onContinue={() => (stage === 'done' ? go('kyc-submitted') : setStage('otp'))}
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
        <Button className="mt-2 w-[220px]" onClick={() => go('get-started')}>
          {kycSubmitted.cta}
        </Button>
      </div>
    </AppShell>
  )
}
