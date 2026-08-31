export const screens = [
  { id: 'create-account', label: 'Create Account', group: 'Sign up' },
  { id: 'otp-email', label: 'OTP — Email', group: 'Sign up' },
  { id: 'otp-phone', label: 'OTP — Phone', group: 'Sign up' },
  { id: 'basic-info', label: 'Basic Info', group: 'Sign up' },
  { id: 'account-created', label: 'Account Created', group: 'Sign up' },
  { id: 'login', label: 'Login', group: 'Log in' },
  { id: 'google-auth', label: 'Google Auth', group: 'Log in' },
  { id: 'get-started', label: 'Get Started', group: 'App' },
  { id: 'kyc-business', label: 'KYC — Business', group: 'KYC' },
  { id: 'kyc-bank', label: 'KYC — Bank Account', group: 'KYC' },
  { id: 'kyc-2fa', label: 'KYC — 2FA', group: 'KYC' },
  { id: 'kyc-submitted', label: 'KYC — Submitted', group: 'KYC' },
] as const

export type ScreenId = (typeof screens)[number]['id']

const ids = screens.map((s) => s.id) as readonly string[]

export function readHash(): ScreenId {
  const h = window.location.hash.replace(/^#\/?/, '')
  return (ids.includes(h) ? h : 'create-account') as ScreenId
}

/** Mocked sign-up state, shared across screens so the flow hangs together. */
export type SignupState = {
  phone: string
  email: string
  country: string
  method: 'phone' | 'email' | 'google'
  businessType: string
  twoFactorOn: boolean
  completedTasks: string[]
}
