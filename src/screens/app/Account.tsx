import { useState, type ReactNode } from 'react'
import {
  Card,
  DataTable,
  EmptyState,
  FilterPill,
  PageHeader,
  Pagination,
  Pill,
  Row,
  RowMenu,
  SectionLabel,
  Step,
  TabBar,
  Toolbar,
} from '../../components/app/Console'
import { cells } from '../../components/app/consoleUtils'
import { AddedBy } from '../../components/app/AddedBy'
import { Button } from '../../components/ui/Button'
import { Checkbox, SelectField, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { ConsoleShell } from '../../layouts/ConsoleShell'
import {
  addressBook as ab,
  companyList as cl,
  contacts as ct,
  employees as em,
  filters,
  profile as pf,
  referrals as rf,
} from '../../data/appData'
import { useFlow } from '../../prototype/flowContext'
import { useSession, type UserId } from '../../prototype/sessionContext'
import type { ScreenId } from '../../prototype/screens'

/**
 * "My Profile sections" rail — the 232px sub-sidebar on the profile frames
 * (Figma node 4001:222163, page "1. My Profile").
 */
function ProfileSections({ active }: { active: string }) {
  const { go } = useFlow()
  return (
    <nav aria-label={pf.sectionsLabel} className="shrink-0 xl:w-[220px]">
      <p className="mb-s200 text-xs4 text-neutral-500">{pf.sectionsLabel}</p>
      <div className="flex gap-s200 overflow-x-auto xl:flex-col">
        {pf.sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id as ScreenId)}
            className={`shrink-0 rounded-s200 px-s300 py-s200 text-left text-xs3 transition-colors ${
              s.id === active
                ? 'bg-primary-25 font-semibold text-primary-400'
                : 'text-text-secondary hover:bg-neutral-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function ProfileLayout({
  active,
  breadcrumb,
  children,
}: {
  active: string
  breadcrumb: string[]
  children: ReactNode
}) {
  return (
    <ConsoleShell breadcrumb={breadcrumb} activeNav="profile">
      <div className="flex flex-col gap-s300 xl:flex-row">
        <ProfileSections active={active} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ConsoleShell>
  )
}

/** Account Information — Figma node 4001:222163. */
export function Profile() {
  const { user } = useSession()

  // The profile reflects whoever is signed in; the Figma frame is drawn with
  // Dheana's details, which is User B.
  const valueFor = (id: string) => {
    if (!user) return undefined
    if (id === 'fullName') return user.name
    if (id === 'email') return user.email
    if (id === 'phone') return user.phone
    if (id === 'role') return user.role
    return undefined
  }

  return (
    <ProfileLayout active="profile" breadcrumb={pf.breadcrumb}>
      <div className="mb-s300 flex flex-wrap items-center gap-s200">
        <h1 className="text-lg font-bold text-text-primary">{pf.title}</h1>
        <div className="ml-auto flex gap-s200">
          <Button variant="outline">{pf.cancel}</Button>
          <Button disabled>{pf.save}</Button>
        </div>
      </div>

      <Card>
        {/* Profile picture */}
        <div className="flex flex-col gap-s300 border-b border-neutral-200 pb-s400 lg:flex-row">
          <div className="lg:w-[340px] lg:shrink-0">
            <p className="text-xs3 font-semibold text-text-primary">{pf.picture.label}</p>
            <p className="mt-s100 text-xs4 text-text-secondary">{pf.picture.help}</p>
          </div>
          <div className="flex flex-wrap items-start gap-s300">
            <span className="grid size-20 shrink-0 place-items-center rounded-s200 bg-primary-100 text-lg font-bold text-primary-600">
              {user?.initials ?? '—'}
            </span>
            <div>
              <ul className="flex flex-col gap-0.5">
                {pf.picture.rules.map((r) => (
                  <li key={r} className="flex items-center gap-s200 text-xs4 text-text-secondary">
                    <span className="size-1 rounded-full bg-neutral-400" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-s200">
                <Button variant="outline">
                  <Icon name="upload" className="size-4" />
                  {pf.picture.upload}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Field rows — label + help on the left, control on the right */}
        {pf.fields.map((f) => (
          <div
            key={f.id}
            className="flex flex-col gap-s300 border-b border-neutral-200 py-s400 last:border-0 last:pb-0 lg:flex-row"
          >
            <div className="lg:w-[340px] lg:shrink-0">
              <p className="text-xs3 font-semibold text-text-primary">{f.label}</p>
              {f.help.split('\n').map((line) => (
                <p key={line} className="mt-s100 text-xs4 text-text-secondary">
                  {line}
                </p>
              ))}
            </div>

            <div className="min-w-0 max-w-[520px] flex-1">
              <div className="flex flex-wrap items-start gap-s200">
                <div className="min-w-0 flex-1">
                  <div
                    className={`flex h-8 items-center gap-s200 rounded-s200 border border-neutral-300 px-s200 ${
                      f.readOnly ? 'bg-neutral-100' : 'bg-white'
                    }`}
                  >
                    {f.id === 'phone' && (
                      <span className="grid h-3 w-4 shrink-0 grid-rows-2 overflow-hidden rounded-[2px]">
                        <span className="bg-[#e03030]" />
                        <span className="bg-white" />
                      </span>
                    )}
                    <input
                      key={`${user?.id ?? 'none'}-${f.id}`}
                      aria-label={f.label}
                      defaultValue={valueFor(f.id) ?? f.value}
                      readOnly={f.readOnly}
                      className="min-w-0 flex-1 bg-transparent text-xs3 text-text-primary outline-none"
                    />
                    {'verified' in f && f.verified && (
                      <span className="flex shrink-0 items-center gap-s100 text-xs4 font-semibold text-success">
                        <Icon name="circle-check" className="size-3.5" />
                        {f.verified}
                      </span>
                    )}
                  </div>
                  {'note' in f && f.note && (
                    <p className="mt-s100 text-xs4 text-text-secondary">{f.note}</p>
                  )}
                  {'warning' in f && f.warning && (
                    <p className="mt-s200 flex items-center gap-s200 rounded-s200 bg-warning-bg px-s200 py-1.5 text-xs4 text-warning">
                      <Icon name="alert-circle" className="size-3.5 shrink-0" />
                      {f.warning}
                    </p>
                  )}
                </div>
                {'action' in f && f.action && <Button variant="outline">{f.action}</Button>}
              </div>
            </div>
          </div>
        ))}
        {user && (
          <div className="flex flex-col gap-s300 border-t border-neutral-200 pt-s400 lg:flex-row">
            <div className="lg:w-[340px] lg:shrink-0">
              <p className="text-xs3 font-semibold text-text-primary">Sign-in method</p>
              <p className="mt-s100 text-xs4 text-text-secondary">
                How this account authenticates. Prototype only.
              </p>
            </div>
            <div className="min-w-0 max-w-[520px] flex-1">
              <span className="inline-flex items-center gap-s200 rounded-s200 bg-neutral-100 px-s300 py-s200 text-xs3 font-semibold text-text-primary">
                <Icon
                  name={user.signInMethod === 'Google SSO' ? 'globe' : 'phone'}
                  className="size-4 text-text-secondary"
                />
                {user.signInMethod}
              </span>
            </div>
          </div>
        )}
      </Card>
    </ProfileLayout>
  )
}

type AddressRow = (typeof ab.rows)[number] & { addedBy?: UserId }

/** Address Book — Figma "My Profile - Address Book", node 4001:222917. */
export function AddressBook() {
  const { shared, add } = useSession()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const f = ab.form

  const field = (k: string) => ({
    value: form[k] ?? '',
    onChange: (e: { target: { value: string } }) => setForm((v) => ({ ...v, [k]: e.target.value })),
  })

  // Rows added this session come first, so a new entry is visible immediately.
  const rows: AddressRow[] = [
    ...shared.addresses.map((r) => ({
      label: String(r.fields.label ?? ''),
      recipient: String(r.fields.recipient ?? ''),
      address: String(r.fields.address ?? ''),
      type: String(r.fields.type ?? 'Shipping'),
      primary: Boolean(r.fields.primary),
      addedBy: r.addedBy,
    })),
    ...ab.rows,
  ]

  function save() {
    if (!form.label?.trim() || !form.recipient?.trim()) return
    add('addresses', {
      label: form.label.trim(),
      recipient: form.recipient.trim(),
      address: [form.street, form.city, form.province, form.postal].filter(Boolean).join(', '),
      type: form.type || 'Shipping',
      primary: false,
    })
    setForm({})
    setAdding(false)
  }

  return (
    <ProfileLayout active="address-book" breadcrumb={ab.breadcrumb}>
      <PageHeader title={ab.title}>
        <Button onClick={() => setAdding((v) => !v)}>
          <Icon name="plus" className="size-4" />
          {ab.create}
        </Button>
      </PageHeader>

      <p className="mb-s300 text-xs3 text-text-secondary">{ab.subtitle}</p>

      {adding && (
        <Card className="mb-s300">
          <SectionLabel>{f.title}</SectionLabel>
          <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
            <TextField name="label" label={f.label} placeholder={f.labelPlaceholder} required {...field('label')} />
            <TextField name="recipient" label={f.recipient} placeholder={f.recipientPlaceholder} required {...field('recipient')} />
            <TextField name="phone" label={f.phone} placeholder={f.phonePlaceholder} {...field('phone')} />
            <SelectField
              name="type"
              label={f.type}
              placeholder="Select a type"
              options={f.types.map((t) => ({ value: t, label: t }))}
              {...field('type')}
            />
            <TextField
              name="street"
              label={f.street}
              placeholder={f.streetPlaceholder}
              containerClassName="sm:col-span-2"
              required
              {...field('street')}
            />
            <SelectField
              name="city"
              label={f.city}
              placeholder={f.cityPlaceholder}
              options={ab.cities.map((c) => ({ value: c, label: c }))}
              {...field('city')}
            />
            <SelectField
              name="province"
              label={f.province}
              placeholder={f.provincePlaceholder}
              options={ab.provinces.map((c) => ({ value: c, label: c }))}
              {...field('province')}
            />
            <TextField name="postal" label={f.postal} placeholder={f.postalPlaceholder} {...field('postal')} />
          </div>
          <div className="mt-s300 flex gap-s200">
            <Button onClick={save} disabled={!form.label?.trim() || !form.recipient?.trim()}>
              {f.save}
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              {f.cancel}
            </Button>
          </div>
        </Card>
      )}

      <Toolbar searchPlaceholder={ab.searchPlaceholder}>
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<AddressRow>
          columns={ab.columns}
          rows={rows}
          empty={<EmptyState title={ab.emptyTitle} body={ab.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="flex items-center gap-s200 whitespace-nowrap">
              <span className="font-semibold">{r.label}</span>
              {r.primary && <Pill tone="info">{ab.primaryBadge}</Pill>}
              {r.addedBy && <AddedBy by={r.addedBy} />}
            </span>,
            r.recipient,
            <span className="block max-w-[320px]">{r.address}</span>,
            <Pill tone="neutral">{r.type}</Pill>,
            <RowMenu />
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex flex-wrap items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.label}</span>
                {r.primary && <Pill tone="info">{ab.primaryBadge}</Pill>}
                {r.addedBy && <AddedBy by={r.addedBy} />}
              </div>
              <Row label={ab.columns[2]} value={r.recipient} />
              <p className="mt-s200 text-xs3 text-text-secondary">{r.address}</p>
            </>
          )}
        />
        <Pagination noun={ab.perPageNoun} />
      </Card>
    </ProfileLayout>
  )
}

type CompanyRow = (typeof cl.rows)[number]

/** Company List — Figma "My Profile - Company List", node 4001:223181. */
export function CompanyList() {
  return (
    <ProfileLayout active="company-list" breadcrumb={cl.breadcrumb}>
      <PageHeader title={cl.title}>
        <Button>
          <Icon name="plus" className="size-4" />
          {cl.create}
        </Button>
      </PageHeader>

      <p className="mb-s300 text-xs3 text-text-secondary">{cl.subtitle}</p>

      <Toolbar searchPlaceholder={cl.searchPlaceholder}>
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<CompanyRow>
          columns={cl.columns}
          rows={cl.rows}
          empty={<EmptyState title={cl.emptyTitle} body={cl.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="flex items-center gap-s200">
              <span className="grid size-8 shrink-0 place-items-center rounded-s200 bg-primary-25 text-primary-400">
                <Icon name="building" className="size-4" />
              </span>
              <span className="font-semibold">{r.name}</span>
            </span>,
            <span className="whitespace-nowrap">{r.reg}</span>,
            r.role,
            <Pill>{r.status}</Pill>,
            <RowMenu />
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.name}</span>
                <Pill>{r.status}</Pill>
              </div>
              <Row label={cl.columns[2]} value={r.reg} />
              <Row label={cl.columns[3]} value={r.role} />
            </>
          )}
        />
        <Pagination noun={cl.perPageNoun} />
      </Card>
    </ProfileLayout>
  )
}

type EmployeeRow = (typeof em.rows)[number] & { addedBy?: UserId }

/** My Employee — Figma "My Employee - Employee List", node 4001:246556. */
export function Employees() {
  const { shared, add } = useSession()
  const [inviting, setInviting] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const f = em.form

  const field = (k: string) => ({
    value: form[k] ?? '',
    onChange: (e: { target: { value: string } }) => setForm((v) => ({ ...v, [k]: e.target.value })),
  })

  const rows: EmployeeRow[] = [
    ...shared.employees.map((r) => ({
      name: String(r.fields.name ?? ''),
      email: String(r.fields.email ?? ''),
      role: String(r.fields.role ?? ''),
      status: 'Invited',
      joined: '—',
      addedBy: r.addedBy,
    })),
    ...em.rows,
  ]

  const canSend = Boolean(form.name?.trim() && form.email?.trim() && form.role)

  function send() {
    if (!canSend) return
    add('employees', {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    })
    setForm({})
    setSent(true)
  }

  return (
    <ConsoleShell breadcrumb={em.breadcrumb} activeNav="employees">
      <PageHeader title={em.title}>
        <Button
          onClick={() => {
            setInviting((v) => !v)
            setSent(false)
          }}
        >
          <Icon name="plus" className="size-4" />
          {em.create}
        </Button>
      </PageHeader>

      <p className="mb-s300 text-xs3 text-text-secondary">{em.subtitle}</p>

      {inviting && (
        <Card className="mb-s300">
          {sent ? (
            <div className="rounded-s200 bg-success-bg p-s300">
              <h3 className="text-xs2 font-semibold text-success">{f.sentTitle}</h3>
              <p className="mt-s100 text-xs3 text-text-secondary">{f.sentBody}</p>
              <div className="mt-s300">
                <Button variant="outline" onClick={() => setInviting(false)}>
                  {em.title}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <SectionLabel>{f.title}</SectionLabel>
              <div className="grid grid-cols-1 gap-s300 sm:grid-cols-3">
                <TextField name="name" label={f.name} placeholder={f.namePlaceholder} required {...field('name')} />
                <TextField
                  name="email"
                  type="email"
                  label={f.email}
                  placeholder={f.emailPlaceholder}
                  required
                  {...field('email')}
                />
                <SelectField
                  name="role"
                  label={f.role}
                  placeholder={f.rolePlaceholder}
                  options={em.roles.map((r) => ({ value: r, label: r }))}
                  required
                  {...field('role')}
                />
              </div>

              <div className="mt-s400">
                <SectionLabel>{f.permissionsSection}</SectionLabel>
                <div className="grid grid-cols-1 gap-s200 sm:grid-cols-2">
                  {f.permissions.map((perm) => (
                    <Checkbox
                      key={perm.id}
                      id={perm.id}
                      label={perm.label}
                      checked={false}
                      onChange={() => {}}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-s400 flex gap-s200">
                <Button onClick={send} disabled={!canSend}>
                  {f.send}
                </Button>
                <Button variant="ghost" onClick={() => setInviting(false)}>
                  {f.cancel}
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      <Toolbar searchPlaceholder={em.searchPlaceholder}>
        <FilterPill label={filters.allRoles} options={em.roles} />
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<EmployeeRow>
          columns={em.columns}
          rows={rows}
          empty={<EmptyState title={em.emptyTitle} body={em.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="flex items-center gap-s200">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-100 text-xs4 font-bold text-primary-600">
                {r.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span className="font-semibold whitespace-nowrap">{r.name}</span>
              {r.addedBy && <AddedBy by={r.addedBy} />}
            </span>,
            <span className="whitespace-nowrap">{r.email}</span>,
            r.role,
            <Pill>{r.status}</Pill>,
            <span className="whitespace-nowrap">{r.joined}</span>,
            <RowMenu />
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex flex-wrap items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.name}</span>
                <Pill>{r.status}</Pill>
                {r.addedBy && <AddedBy by={r.addedBy} />}
              </div>
              <Row label={em.columns[2]} value={r.email} />
              <Row label={em.columns[3]} value={r.role} />
            </>
          )}
        />
        <Pagination noun={em.perPageNoun} />
      </Card>
    </ConsoleShell>
  )
}

type ContactTab = (typeof ct.tabs)[number]['id']
type ContactRow = (typeof ct.customers)[number] & { addedBy?: UserId }

/** Business Contact — Figma "Business Contact", node 4001:253744. */
export function Contacts() {
  const { shared, add } = useSession()
  const [tab, setTab] = useState<ContactTab>('customers')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const f = ct.form

  const field = (k: string) => ({
    value: form[k] ?? '',
    onChange: (e: { target: { value: string } }) => setForm((v) => ({ ...v, [k]: e.target.value })),
  })

  const kind = tab === 'customers' ? 'customer' : 'supplier'
  const rows: ContactRow[] = [
    ...shared.contacts
      .filter((r) => (r.fields.kind ?? 'customer') === kind)
      .map((r) => ({
        company: String(r.fields.company ?? ''),
        person: String(r.fields.person ?? ''),
        email: String(r.fields.email ?? ''),
        phone: String(r.fields.phone ?? ''),
        linked: false,
        addedBy: r.addedBy,
      })),
    ...(tab === 'customers' ? ct.customers : ct.suppliers),
  ]

  const canSave = Boolean(form.company?.trim() && form.person?.trim())

  function save() {
    if (!canSave) return
    add('contacts', {
      kind,
      company: form.company.trim(),
      person: form.person.trim(),
      email: form.email?.trim() ?? '',
      phone: form.phone?.trim() ?? '',
    })
    setForm({})
    setAdding(false)
  }

  return (
    <ConsoleShell breadcrumb={ct.breadcrumb} activeNav="contacts">
      <PageHeader title={ct.title}>
        <Button onClick={() => setAdding((v) => !v)}>
          <Icon name="plus" className="size-4" />
          {ct.create}
        </Button>
      </PageHeader>

      <p className="mb-s300 text-xs3 text-text-secondary">{ct.subtitle}</p>

      {adding && (
        <Card className="mb-s300">
          <SectionLabel>{f.title}</SectionLabel>
          <p className="mb-s300 text-xs4 text-text-secondary">
            Saved as a {kind} — the tab you are on decides which list it joins.
          </p>
          <div className="grid grid-cols-1 gap-s300 sm:grid-cols-2">
            <TextField name="company" label={f.company} placeholder={f.companyPlaceholder} required {...field('company')} />
            <TextField name="person" label={f.person} placeholder={f.personPlaceholder} required {...field('person')} />
            <TextField name="email" type="email" label={f.email} placeholder={f.emailPlaceholder} {...field('email')} />
            <TextField name="phone" label={f.phone} placeholder={f.phonePlaceholder} {...field('phone')} />
            <TextField
              name="address"
              label={f.address}
              placeholder={f.addressPlaceholder}
              containerClassName="sm:col-span-2"
              {...field('address')}
            />
          </div>
          <div className="mt-s300 flex gap-s200">
            <Button onClick={save} disabled={!canSave}>
              {f.save}
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              {f.cancel}
            </Button>
          </div>
        </Card>
      )}

      <TabBar tabs={ct.tabs} value={tab} onChange={setTab} />

      <Toolbar searchPlaceholder={ct.searchPlaceholder}>
        <FilterPill label={filters.newest} />
      </Toolbar>

      <Card padded={false}>
        <DataTable<ContactRow>
          columns={ct.columns}
          rows={rows}
          empty={<EmptyState title={ct.emptyTitle} body={ct.emptyBody} />}
          render={(r, i) => cells(
            `${i + 1}.`,
            <span className="flex items-center gap-s200">
              <span className="grid size-8 shrink-0 place-items-center rounded-s200 bg-primary-25 text-primary-400">
                <Icon name="building" className="size-4" />
              </span>
              <span className="font-semibold whitespace-nowrap">{r.company}</span>
              {r.addedBy && <AddedBy by={r.addedBy} />}
            </span>,
            r.person,
            <span className="whitespace-nowrap">{r.email}</span>,
            <span className="whitespace-nowrap">{r.phone}</span>,
            r.linked ? <Pill tone="success">{ct.linked}</Pill> : <Pill tone="neutral">{ct.notLinked}</Pill>,
            <RowMenu />
          )}
          card={(r) => (
            <>
              <div className="mb-s200 flex flex-wrap items-center gap-s200">
                <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.company}</span>
                {r.linked ? (
                  <Pill tone="success">{ct.linked}</Pill>
                ) : (
                  <Pill tone="neutral">{ct.notLinked}</Pill>
                )}
                {r.addedBy && <AddedBy by={r.addedBy} />}
              </div>
              <Row label={ct.columns[2]} value={r.person} />
              <Row label={ct.columns[3]} value={r.email} />
              <Row label={ct.columns[4]} value={r.phone} />
            </>
          )}
        />
        <Pagination noun={ct.perPageNoun} />
      </Card>
    </ConsoleShell>
  )
}

type ReferralTab = (typeof rf.tabs)[number]['id']
type ReferralRow = (typeof rf.rows)[number]

/** Referrals — Figma "Referrals", node 4001:263130 (page "4. Referrals"). */
export function Referrals() {
  const [tab, setTab] = useState<ReferralTab>('how')
  const [copied, setCopied] = useState<'link' | 'code' | null>(null)

  function copy(which: 'link' | 'code', value: string) {
    navigator.clipboard?.writeText(value).catch(() => {})
    setCopied(which)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ConsoleShell breadcrumb={rf.breadcrumb} activeNav="referrals">
      <PageHeader title={rf.title} />

      {/* The mobile frames split this page into tabs; desktop shows both stacked. */}
      <div className="xl:hidden">
        <TabBar tabs={rf.tabs} value={tab} onChange={setTab} />
      </div>

      <div className={tab === 'how' ? '' : 'hidden xl:block'}>
        <Card className="mb-s300">
          <SectionLabel>{rf.howTitle}</SectionLabel>
          <p className="mb-s400 text-xs3 text-text-secondary">{rf.howSubtitle}</p>

          <div className="grid grid-cols-1 gap-s400 md:grid-cols-3">
            {rf.steps.map((s, i) => (
              <Step key={s.title} index={i + 1} title={s.title} body={s.body} />
            ))}
          </div>

          <div className="my-s400 h-px bg-neutral-200" />

          <div className="flex flex-col gap-s300 lg:flex-row lg:items-start">
            <div className="lg:w-[400px] lg:shrink-0">
              <p className="text-xs3 font-semibold text-text-primary">{rf.linkLabel}</p>
              <p className="mt-s100 text-xs4 text-text-secondary">{rf.linkSubtitle}</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-s200">
              <input
                readOnly
                aria-label={rf.linkLabel}
                value={rf.link}
                className="h-8 min-w-0 flex-1 rounded-s200 border border-neutral-300 bg-white px-s200 text-xs3 text-text-primary outline-none sm:max-w-[400px]"
              />
              <Button variant="outline" onClick={() => copy('link', rf.link)}>
                <Icon name="copy" className="size-4" />
                {copied === 'link' ? rf.copied : rf.copy}
              </Button>
            </div>
          </div>

          <p className="mt-s300 text-xs4 text-text-secondary">{rf.orCopy}</p>

          <div className="mt-s300 flex flex-col gap-s300 lg:flex-row lg:items-start">
            <div className="lg:w-[400px] lg:shrink-0">
              <p className="text-xs3 font-semibold text-text-primary">{rf.codeLabel}</p>
              <p className="mt-s100 text-xs4 text-text-secondary">{rf.codeSubtitle}</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-s200">
              <input
                readOnly
                aria-label={rf.codeLabel}
                value={rf.code}
                className="h-8 min-w-0 flex-1 rounded-s200 border border-neutral-300 bg-white px-s200 text-xs3 font-bold text-text-primary outline-none sm:max-w-[400px]"
              />
              <Button variant="outline" onClick={() => copy('code', rf.code)}>
                <Icon name="copy" className="size-4" />
                {copied === 'code' ? rf.copied : rf.copy}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className={tab === 'history' ? '' : 'hidden xl:block'}>
        <Card padded={false}>
          <div className="p-s300 pb-0">
            <SectionLabel>{rf.historyTitle}</SectionLabel>
            <p className="mb-s300 text-xs3 text-text-secondary">{rf.historySubtitle}</p>
            <Toolbar searchPlaceholder={rf.searchPlaceholder}>
              <FilterPill label={filters.newest} />
            </Toolbar>
          </div>

          <DataTable<ReferralRow>
            columns={rf.columns}
            rows={rf.rows}
            empty={<EmptyState title={rf.emptyTitle} body={rf.emptyBody} />}
            render={(r, i) => cells(
              `${i + 1}.`,
              <span className="font-semibold whitespace-nowrap">{r.name}</span>,
              <span className="whitespace-nowrap">{r.email}</span>,
              <span className="whitespace-nowrap">{r.date}</span>,
              <Pill>{r.status}</Pill>
            )}
            card={(r) => (
              <>
                <div className="mb-s200 flex items-center gap-s200">
                  <span className="min-w-0 flex-1 truncate text-xs3 font-semibold">{r.name}</span>
                  <Pill>{r.status}</Pill>
                </div>
                <Row label={rf.columns[2]} value={r.email} />
                <Row label={rf.columns[3]} value={r.date} />
              </>
            )}
          />
          <Pagination noun={rf.perPageNoun} />
        </Card>

        <p className="mt-s300 flex items-start gap-s200 rounded-s200 bg-neutral-100 p-s300 text-xs3 text-text-secondary">
          <Icon name="info" className="mt-px size-4 shrink-0 text-neutral-500" />
          {rf.statusNote}
        </p>
      </div>
    </ConsoleShell>
  )
}
