import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { LanguagePicker, Modal } from '../../components/ui/Misc'
import { AuthLayout } from '../../layouts/AuthLayout'
import {
  accountCreated,
  basicInfo as copy,
  countries,
  createAccount,
  employeeCounts,
  industries,
} from '../../data/mock'
import { useFlow } from '../../prototype/flowContext'

/** Figma: "Phone Email Onboarding 3 - Basic Info" (node 4001:76532), its
 *  confirmation variant (4001:76576) and "4 - Account Created" (4001:76718),
 *  which is this same form behind a modal. */
export function BasicInfo({ showCreated = false }: { showCreated?: boolean }) {
  const { go, state } = useFlow()
  const [modal, setModal] = useState(showCreated)
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    role: '',
    about: '',
    city: '',
    country: 'id',
    industry: '',
    employees: '',
  })
  const [touched, setTouched] = useState(false)

  const required = ['fullName', 'company', 'city', 'industry'] as const
  const missing = (k: (typeof required)[number]) =>
    touched && !form[k].trim() ? 'This field is required' : ''
  const canSubmit = required.every((k) => form[k].trim())

  const upd = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

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
      <div className="flex w-full max-w-[521px] flex-col gap-s400">
        <div className="flex flex-col gap-s200">
          <h1 className="text-xl font-bold text-text-primary">{copy.title}</h1>
          <p className="text-xs2 text-text-primary">{copy.subtitle}</p>
        </div>

        <div className="flex flex-col gap-s300">
          <TextField
            name="fullName"
            label="Full name"
            required
            placeholder="As shown on your ID"
            value={form.fullName}
            error={missing('fullName')}
            onChange={upd('fullName')}
          />
          <TextField
            name="company"
            label="Business name"
            required
            placeholder="e.g. Sinar Jaya Trading"
            value={form.company}
            error={missing('company')}
            onChange={upd('company')}
          />
          <TextField
            name="role"
            label="Your role"
            placeholder="e.g. Owner, Purchasing Manager"
            value={form.role}
            onChange={upd('role')}
          />
          <TextAreaField
            name="about"
            label="What does your business do?"
            placeholder="A sentence is enough — what you buy or sell, and to whom."
            value={form.about}
            onChange={upd('about')}
          />

          <div className="flex flex-col gap-s300 sm:flex-row">
            <TextField
              name="city"
              label="City"
              required
              placeholder="Jakarta"
              value={form.city}
              error={missing('city')}
              onChange={upd('city')}
              containerClassName="flex-1"
            />
            <SelectField
              name="country"
              label="Country"
              required
              options={countries.map((c) => ({ value: c.value, label: c.label }))}
              value={form.country}
              onChange={upd('country')}
              containerClassName="flex-1"
            />
          </div>

          <SelectField
            name="industry"
            label="Industry"
            required
            placeholder="Select an industry"
            options={industries}
            value={form.industry}
            error={missing('industry')}
            onChange={upd('industry')}
          />
          <SelectField
            name="employees"
            label="Team size"
            placeholder="Select a range"
            options={employeeCounts}
            value={form.employees}
            onChange={upd('employees')}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-s300 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-s100">
            <span className="text-xs4 text-neutral-500">{copy.wrongDetails}</span>
            <Button variant="ghost" onClick={() => go('create-account')}>
              {copy.startOver}
            </Button>
          </div>
          <Button
            className="w-full sm:w-[254px]"
            disabled={!canSubmit}
            onClick={() => {
              setTouched(true)
              if (canSubmit) setModal(true)
            }}
          >
            {copy.submit}
          </Button>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)}>
        <div className="flex flex-col items-center gap-s300 px-10 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary-50">
            <svg viewBox="0 0 24 24" className="size-8 text-primary-400" fill="none" aria-hidden="true">
              <path
                d="m5 12.5 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-text-primary">{accountCreated.title}</h2>
          <p className="text-xs2 text-text-secondary">{accountCreated.subtitle}</p>
          <p className="text-xs3 text-neutral-500">
            Signed up as <span className="font-bold text-text-primary">{state.email || 'you@company.com'}</span>
          </p>
          <Button className="mt-2 w-[220px]" onClick={() => go('get-started')}>
            {accountCreated.cta}
          </Button>
        </div>
      </Modal>
    </AuthLayout>
  )
}
