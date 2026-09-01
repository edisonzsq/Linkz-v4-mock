import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { Modal } from '../../components/ui/Misc'
import { KycField, KycLayout, UploadBox } from '../../layouts/KycLayout'
import {
  companySizes,
  industries,
  kycBusiness as copy,
  registrationTypes,
  states,
} from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/** Figma: "Phone Email KYC - Business Overview - Personal" (4001:84233)
 *  and the Established variant (4001:84868). */
const emptyForm = {
  registration: 'personal',
  companyName: '',
  industry: '',
  companySize: '1-5',
  address: '',
  state: '',
  postal: '',
}

export function KycBusinessOverview() {
  const { go } = useFlow()
  const [form, setForm] = useState(emptyForm)
  /** Pending registration value while the "this clears your answers" warning is up. */
  const [pendingRegistration, setPendingRegistration] = useState<string | null>(null)
  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  // Changing the registration type changes which documents verification asks
  // for, so it discards everything already entered. Only warn when there is
  // something to lose — switching on an untouched form just switches.
  const hasAnswers =
    form.companyName.trim() !== '' ||
    form.industry !== '' ||
    form.address.trim() !== '' ||
    form.state !== '' ||
    form.postal.trim() !== ''

  function requestRegistrationChange(next: string) {
    if (next === form.registration) return
    if (!hasAnswers) {
      setForm((f) => ({ ...f, registration: next }))
      return
    }
    setPendingRegistration(next)
  }

  function confirmRegistrationChange() {
    if (pendingRegistration) setForm({ ...emptyForm, registration: pendingRegistration })
    setPendingRegistration(null)
  }

  const canContinue = form.companyName.trim() !== '' && form.industry !== ''

  return (
    <KycLayout
      active="business"
      sectionLabel={copy.sectionLabel}
      title={copy.title}
      continueLabel={copy.continueCta}
      continueDisabled={!canContinue}
      onContinue={() => go('kyc-bank')}
    >
      <p className="text-xs3 text-text-secondary">{copy.intro}</p>

      <KycField label={copy.fields.registration.label} hint={copy.fields.registration.hint}>
        <SelectField
          name="registration"
          options={registrationTypes}
          value={form.registration}
          onChange={(e) => requestRegistrationChange(e.target.value)}
        />
      </KycField>

      <KycField label={copy.fields.companyName.label} hint={copy.fields.companyName.hint}>
        <TextField
          name="companyName"
          placeholder={copy.fields.companyName.placeholder}
          help={copy.fields.companyName.help}
          value={form.companyName}
          onChange={upd('companyName')}
        />
      </KycField>

      <KycField label={copy.fields.industry.label} hint={copy.fields.industry.hint}>
        <SelectField
          name="industry"
          placeholder={copy.fields.industry.placeholder}
          options={industries}
          value={form.industry}
          onChange={upd('industry')}
        />
      </KycField>

      <KycField label={copy.fields.companySize.label} hint={copy.fields.companySize.hint}>
        <div className="w-full lg:w-[200px]">
          <SelectField
            name="companySize"
            options={companySizes}
            value={form.companySize}
            onChange={upd('companySize')}
          />
        </div>
      </KycField>

      <KycField label={copy.fields.address.label} hint={copy.fields.address.hint}>
        <div className="flex w-full flex-col items-start gap-s200">
          <TextAreaField
            name="address"
            rows={4}
            placeholder={copy.fields.address.placeholder}
            value={form.address}
            onChange={upd('address')}
          />
          <div className="flex w-full items-start gap-s300">
            <SelectField
              name="state"
              label={copy.fields.address.state}
              options={states}
              placeholder="Select a state"
              value={form.state}
              onChange={upd('state')}
              containerClassName="flex-1"
            />
            <TextField
              name="postal"
              label={copy.fields.address.postal}
              inputMode="numeric"
              placeholder="12345"
              value={form.postal}
              onChange={(e) => setForm((f) => ({ ...f, postal: e.target.value.replace(/\D/g, '') }))}
              containerClassName="flex-1"
            />
          </div>
        </div>
      </KycField>

      <div className="h-px w-full border-t border-neutral-200" />

      <div className="flex w-full max-w-[816px] flex-col items-start justify-center gap-s200 rounded-s200 bg-neutral-100 p-s200">
        <div className="flex w-full items-center gap-s200">
          <div className="flex min-w-px flex-1 items-center gap-s100">
            <Icon name="info" className="size-4 shrink-0 text-text-secondary" />
            <p className="flex-1 text-[10px] leading-[14px] text-text-secondary">
              {copy.uploadAlert.prefix}
              <span className="font-bold">{copy.uploadAlert.formats}</span>
              {copy.uploadAlert.middle}
              <span className="font-bold">{copy.uploadAlert.size}</span>
              {copy.uploadAlert.suffix}
            </p>
          </div>
        </div>
      </div>

      {copy.uploads.map((u) => (
        <KycField key={u.id} label={u.label} hint={u.hint} bold={u.id !== 'npwp'}>
          <UploadBox label={u.label} />
        </KycField>
      ))}
      {/* Figma 4001:84707 — title above the icon, two paragraphs, no auto-dismiss. */}
      <Modal open={pendingRegistration !== null} onClose={() => setPendingRegistration(null)} width={480}>
        <div className="flex flex-col items-center gap-s400 px-10 pt-10 pb-8 text-center">
          <h2 className="text-lg font-bold text-text-primary">{copy.registrationWarning.title}</h2>
          <span className="grid size-16 place-items-center rounded-full bg-[#f59e0b] text-white">
            <span className="text-xl font-bold leading-none">!</span>
          </span>
          <div className="flex flex-col gap-s300">
            <p className="text-xs2 text-text-secondary">{copy.registrationWarning.body1}</p>
            <p className="text-xs2 text-text-secondary">{copy.registrationWarning.body2}</p>
          </div>
          <div className="mt-s200 grid w-full grid-cols-1 gap-s200 sm:grid-cols-2">
            <Button variant="outline" onClick={() => setPendingRegistration(null)}>
              {copy.registrationWarning.cancel}
            </Button>
            <Button onClick={confirmRegistrationChange}>
              {copy.registrationWarning.confirm}
            </Button>
          </div>
        </div>
      </Modal>
    </KycLayout>
  )
}
