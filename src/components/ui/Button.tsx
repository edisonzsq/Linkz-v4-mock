import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-[0_1px_2px_rgba(13,23,40,.16),0_8px_24px_-8px_rgba(79,99,255,.7)] hover:bg-brand-600 hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-white text-ink-800 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-ink-50 shadow-[0_1px_2px_rgba(13,23,40,.06)]',
  ghost: 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/70',
  inverse:
    'bg-white text-ink-900 hover:bg-ink-50 shadow-[0_8px_28px_-10px_rgba(0,0,0,.55)] hover:-translate-y-px',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
