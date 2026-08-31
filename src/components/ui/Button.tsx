import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'text' | 'danger'

const base =
  'inline-flex items-center justify-center gap-s100 rounded-[6px] px-3 py-2 text-xs3 font-semibold transition-colors disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  // Figma: filled brand button
  primary:
    'bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600 disabled:bg-neutral-200 disabled:text-neutral-400',
  // Figma: 1px brand border, brand text (the "Login" / "Continue with Google" buttons)
  outline:
    'border border-primary-400 text-primary-400 hover:bg-primary-50 active:bg-primary-100 disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent',
  ghost:
    'border border-neutral-300 text-text-secondary hover:bg-neutral-50 disabled:text-neutral-400',
  text: 'text-primary-400 hover:text-primary-500 hover:underline px-0 py-0',
  danger: 'bg-danger text-white hover:brightness-110',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
