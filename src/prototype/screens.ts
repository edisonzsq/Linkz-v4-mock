export const screens = [
  { id: 'create-account', label: 'Create Account', group: 'Sign up' },
  { id: 'otp-email', label: 'OTP — Email', group: 'Sign up' },
  { id: 'otp-phone', label: 'OTP — Phone', group: 'Sign up' },
  { id: 'basic-info', label: 'Basic Info', group: 'Sign up' },
  { id: 'account-created', label: 'Account Created', group: 'Sign up' },
  { id: 'benefit', label: 'Benefit / KYC intro', group: 'Sign up' },
  { id: 'login', label: 'Login', group: 'Log in' },
  { id: 'google-auth', label: 'Google Auth', group: 'Log in' },
  { id: 'get-started', label: 'Get Started', group: 'App' },
  { id: 'kyc-business', label: 'KYC — Business', group: 'KYC' },
  { id: 'kyc-bank', label: 'KYC — Bank Account', group: 'KYC' },
  { id: 'kyc-2fa', label: 'KYC — 2FA', group: 'KYC' },
  { id: 'kyc-submitted', label: 'KYC — Submitted', group: 'KYC' },

  /* Success popups, addressable so each can be shown on its own. */
  { id: 'popup-kyc-complete', label: 'Popup — KYC complete', group: 'Sign up' },
  { id: 'popup-2fa-complete', label: 'Popup — 2FA complete', group: 'Sign up' },
  { id: 'popup-welcome', label: 'Popup — First entry', group: 'Sign up' },

  /* ---- V.4 Compilation: general features ---- */
  { id: 'dashboard', label: 'Dashboard', group: 'General' },
  { id: 'sales-orders', label: 'Sales Order', group: 'General' },
  { id: 'purchase-orders', label: 'Purchase Order', group: 'General' },
  { id: 'order-report', label: 'Order Report', group: 'General' },
  { id: 'order-new', label: 'Create Order', group: 'General' },
  { id: 'checkout', label: 'Checkout', group: 'General' },
  { id: 'master-products', label: 'Master Products', group: 'General' },
  { id: 'product-new', label: 'Create Product', group: 'General' },
  { id: 'product-edit', label: 'Edit Product', group: 'General' },
  { id: 'order-detail', label: 'Order Detail', group: 'General' },

  /* ---- V.4 Compilation: finance ---- */
  { id: 'spl', label: 'Seller Pay Later', group: 'Finance' },
  { id: 'bpl', label: 'Buyer Pay Later', group: 'Finance' },
  { id: 'bizloan', label: 'Biz Loan', group: 'Finance' },

  /* ---- V.4 Compilation: account management ---- */
  { id: 'profile', label: 'My Profile', group: 'Account' },
  { id: 'address-book', label: 'Address Book', group: 'Account' },
  { id: 'company-list', label: 'Company List', group: 'Account' },
  { id: 'employees', label: 'My Employee', group: 'Account' },
  { id: 'contacts', label: 'Business Contact', group: 'Account' },
  { id: 'referrals', label: 'Referrals', group: 'Account' },

  { id: 'my-catalogue', label: 'My Catalogue', group: 'Not built' },
  { id: 'shared-catalogue', label: 'Shared with me', group: 'Not built' },
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
  /**
   * Why the user is at the Google screen. Google serves both sign-up and log
   * in, and only sign-up owes Basic Info — see the SSO card `4001:77653`.
   */
  googleIntent: 'signup' | 'login'
  /**
   * How KYC was entered. From Get Started it is "Verify Business after login",
   * which is a different shell — breadcrumb instead of the onboarding logo bar,
   * Cancel beside Continue, and no "Skip for now". Figma `4001:206888`.
   */
  kycMode: 'onboarding' | 'post-login'
  /** SKU of the product being edited — set by clicking a Master Products row. */
  editingSku: string
  /** Order number being viewed — set by clicking an order row. */
  viewingOrder: string
  businessType: string
  twoFactorOn: boolean
  completedTasks: string[]
}
