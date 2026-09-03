import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { ConfirmDialog, LanguagePicker, Modal } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import {
  accountCreated,
  basicInfo as copy,
  countries,
  createAccount,
  learnOptions,
  startOverConfirm,
  states,
} from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/**
 * Figma: "Phone Email Onboarding 3 - Basic Info" (4001:76532) and
 * "4 - Account Created" (4001:76718), which is this form behind a modal.
 *
 * Layout: 521px column, 45px gaps; fields stacked at 16px; State/Province and
 * Postal Code share a row with a 32px gap; footer row is bottom-aligned with
 * "Start Over" (142px outline) left and "Continue" (254px fill) right.
 */
export function BasicInfo({ showCreated = false }: { showCreated?: boolean }) {
  const { go, reset } = useFlow()
  // Greets you on arrival, over the empty form — not after submitting it. The
  // old code raised it on submit, which left the X with nowhere to go but the
  // form you had just finished.
  const [modal, setModal] = useState(showCreated)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    country: '',
    address: '',
    state: '',
    postal: '',
    referral: '',
    learn: '',
  })
  const [touched, setTouched] = useState(false)

  const required = ['fullName', 'country', 'address', 'state', 'postal', 'learn'] as const
  const err = (k: (typeof required)[number]) =>
    touched && !form[k].trim() ? 'This field is required' : ''
  const canSubmit = required.every((k) => form[k].trim())

  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <AuthLayout
      nudge={{ x: -15, y: 18.5 }}
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
      <div className="flex w-full max-w-[521px] flex-col gap-[45px]">
        <div className="flex flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">{copy.title}</h1>
          <p className="text-xs2 text-text-primary">{copy.subtitle}</p>
        </div>

        <div className="flex flex-col gap-s300">
          <TextField
            name="fullName"
            label={copy.fullName.label}
            required
            placeholder={copy.fullName.placeholder}
            value={form.fullName}
            error={err('fullName')}
            onChange={upd('fullName')}
          />

          <SelectField
            name="country"
            label={copy.country.label}
            required
            placeholder={copy.country.placeholder}
            options={countries.map((c) => ({ value: c.value, label: c.label }))}
            value={form.country}
            error={err('country')}
            onChange={upd('country')}
          />

          <TextAreaField
            name="address"
            label={copy.address.label}
            required
            placeholder={copy.address.placeholder}
            value={form.address}
            error={err('address')}
            onChange={upd('address')}
          />

          <div className="flex flex-col gap-[32px] sm:flex-row">
            <SelectField
              name="state"
              label={copy.state.label}
              required
              placeholder={copy.state.placeholder}
              options={states}
              value={form.state}
              error={err('state')}
              onChange={upd('state')}
              containerClassName="flex-1"
            />
            <TextField
              name="postal"
              label={copy.postal.label}
              required
              inputMode="numeric"
              placeholder={copy.postal.placeholder}
              value={form.postal}
              error={err('postal')}
              onChange={(e) => setForm((f) => ({ ...f, postal: e.target.value.replace(/\D/g, '') }))}
              containerClassName="flex-1"
            />
          </div>

          <TextField
            name="referral"
            label={copy.referral.label}
            placeholder={copy.referral.placeholder}
            value={form.referral}
            onChange={upd('referral')}
          />

          <SelectField
            name="learn"
            label={copy.learn.label}
            required
            placeholder={copy.learn.placeholder}
            options={learnOptions}
            value={form.learn}
            error={err('learn')}
            onChange={upd('learn')}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-s300 sm:flex-row sm:items-end">
          <div className="flex flex-col justify-center gap-s200">
            <p className="w-[200px] text-xs4 text-text-secondary">{copy.wrongDetails}</p>
            <Button
              variant="outline"
              className="w-[142px]"
              onClick={() => setConfirmRestart(true)}
            >
              {copy.startOver}
            </Button>
          </div>
          <Button
            className="w-full sm:w-[254px]"
            onClick={() => {
              setTouched(true)
              if (canSubmit) go('benefit')
            }}
          >
            {copy.submit}
          </Button>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)}>
        <div className="flex flex-col items-center gap-s300 px-10 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary-400">
            <svg viewBox="0 0 24 24" className="size-9 text-white" fill="none" aria-hidden="true">
              <path
                d="m5 12.5 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-text-primary">{accountCreated.title}</h2>
          <p className="max-w-[320px] text-xs3 text-text-secondary">{accountCreated.subtitle}</p>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmRestart}
        title={startOverConfirm.title}
        body={startOverConfirm.body}
        cancelLabel={startOverConfirm.cancel}
        confirmLabel={startOverConfirm.confirm}
        onCancel={() => setConfirmRestart(false)}
        onConfirm={() => {
          // Clear the sign-up state too, or Create Account reopens with the
          // email the user is trying to get away from.
          reset()
          go('create-account')
        }}
      />
    </AuthLayout>
  )
}
