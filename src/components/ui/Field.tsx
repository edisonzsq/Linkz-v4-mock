import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from './Icon'

/* Figma "Text Field" component: 32px control, 8px radius, 1px #d0d5dd border,
   12px/16 label above, 10px/14 helper below, red asterisk when required. */

const controlBase =
  'flex h-8 w-full items-center gap-s200 rounded-s200 border bg-white px-s200 text-xs3 font-semibold text-text-primary transition-colors placeholder:font-medium placeholder:text-neutral-400 focus-within:border-primary-400'

export function Label({
  children,
  required,
  bold,
  subLabel,
  htmlFor,
}: {
  children: ReactNode
  required?: boolean
  bold?: boolean
  subLabel?: string
  htmlFor?: string
}) {
  return (
    <div className="flex flex-col justify-center">
      <label
        htmlFor={htmlFor}
        className={`text-xs3 text-text-primary ${bold ? 'font-bold' : 'font-normal'}`}
      >
        {children}
        {required && <span className="text-danger"> *</span>}
      </label>
      {subLabel && <span className="text-xs4 text-neutral-500">{subLabel}</span>}
    </div>
  )
}

export function HelpText({ children, error }: { children: ReactNode; error?: boolean }) {
  return (
    <p className={`text-xs4 ${error ? 'text-danger' : 'text-text-secondary'}`}>{children}</p>
  )
}

type FieldShellProps = {
  id?: string
  label?: string
  subLabel?: string
  boldLabel?: boolean
  required?: boolean
  help?: string
  error?: string
  className?: string
  children: ReactNode
}

export function FieldShell({
  id,
  label,
  subLabel,
  boldLabel,
  required,
  help,
  error,
  className = '',
  children,
}: FieldShellProps) {
  return (
    <div className={`flex w-full flex-col gap-s100 ${className}`}>
      {label && (
        <Label htmlFor={id} required={required} bold={boldLabel} subLabel={subLabel}>
          {label}
        </Label>
      )}
      {children}
      {(error || help) && <HelpText error={!!error}>{error || help}</HelpText>}
    </div>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  subLabel?: string
  boldLabel?: boolean
  help?: string
  error?: string
  leading?: ReactNode
  trailing?: ReactNode
  containerClassName?: string
}

export function TextField({
  label,
  subLabel,
  boldLabel,
  help,
  error,
  leading,
  trailing,
  required,
  containerClassName,
  className = '',
  id,
  ...rest
}: TextFieldProps) {
  const inputId = id ?? rest.name
  return (
    <FieldShell
      id={inputId}
      label={label}
      subLabel={subLabel}
      boldLabel={boldLabel}
      required={required}
      help={help}
      error={error}
      className={containerClassName}
    >
      <div className={`${controlBase} ${error ? 'border-danger' : 'border-neutral-300'}`}>
        {leading && (
          <div className="flex shrink-0 items-center gap-s200">
            {leading}
            <span className="h-[30px] w-px bg-neutral-300" />
          </div>
        )}
        <input
          id={inputId}
          className={`no-spinner min-w-0 flex-1 bg-transparent outline-none ${className}`}
          {...rest}
        />
        {trailing && (
          <div className="flex shrink-0 items-center gap-s200">
            <span className="h-[30px] w-px bg-neutral-300" />
            {trailing}
          </div>
        )}
      </div>
    </FieldShell>
  )
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  help?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  containerClassName?: string
}

export function SelectField({
  label,
  help,
  error,
  options,
  placeholder,
  required,
  containerClassName,
  id,
  value,
  ...rest
}: SelectFieldProps) {
  const selectId = id ?? rest.name
  return (
    <FieldShell
      id={selectId}
      label={label}
      required={required}
      help={help}
      error={error}
      className={containerClassName}
    >
      <div className={`${controlBase} relative ${error ? 'border-danger' : 'border-neutral-300'}`}>
        <select
          id={selectId}
          value={value}
          className={`min-w-0 flex-1 appearance-none bg-transparent outline-none ${
            value ? 'text-text-primary' : 'font-medium text-neutral-400'
          }`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" className="pointer-events-none size-4 shrink-0 text-neutral-500" />
      </div>
    </FieldShell>
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  help?: string
  error?: string
  containerClassName?: string
}

export function TextAreaField({
  label,
  help,
  error,
  required,
  containerClassName,
  id,
  ...rest
}: TextAreaProps) {
  const areaId = id ?? rest.name
  return (
    <FieldShell
      id={areaId}
      label={label}
      required={required}
      help={help}
      error={error}
      className={containerClassName}
    >
      <textarea
        id={areaId}
        rows={2}
        className={`w-full resize-none rounded-s200 border bg-white p-s200 text-xs3 font-semibold text-text-primary outline-none transition-colors placeholder:font-medium placeholder:text-neutral-400 focus:border-primary-400 ${
          error ? 'border-danger' : 'border-neutral-300'
        }`}
        {...rest}
      />
    </FieldShell>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
  id,
}: {
  label: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-s200">
      <span className="relative mt-px flex size-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer size-4 appearance-none rounded-[4px] border border-neutral-300 bg-white checked:border-primary-400 checked:bg-primary-400"
        />
        <Icon
          name="check"
          strokeWidth={2.4}
          className="pointer-events-none absolute inset-0 size-4 text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className="text-xs3 text-text-secondary">{label}</span>
    </label>
  )
}

export function RadioCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-1 items-start gap-s200 rounded-s200 border p-s200 text-left transition-colors ${
        selected ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'
      }`}
    >
      <span
        className={`mt-px grid size-4 shrink-0 place-items-center rounded-full border ${
          selected ? 'border-primary-400' : 'border-neutral-300'
        }`}
      >
        {selected && <span className="size-2 rounded-full bg-primary-400" />}
      </span>
      <span>
        <span className="block text-xs3 font-semibold text-text-primary">{label}</span>
        {description && <span className="block text-xs4 text-neutral-500">{description}</span>}
      </span>
    </button>
  )
}
