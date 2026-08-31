/**
 * All copy and mock data for the prototype.
 *
 * Copy marked "from Figma" was read directly out of the design file. Everything
 * else is written to match the design's voice — the Figma MCP quota ran out
 * before the remaining screens' text could be read, so treat it as placeholder.
 * See README → "Fidelity notes".
 */

/* ---------- from Figma (node 4001:76309) ---------- */
export const tagline = 'Run Your Business. Unlock Funding. Grow Faster.'

export const support = {
  prompt: 'Trouble signing up?',
  email: 'support@linkzasia.com',
  phone: '(+62)811-1509-265',
}

export const legal = {
  terms: 'https://linkzasia.com/terms-conditions/',
  privacy: 'https://linkzasia.com/privacy-policy/',
}

export const createAccount = {
  title: 'Create LINKZ Account',
  subtitle: 'Quick access to the catalogue with a fast, hassle-free setup.',
  phoneLabel: 'Phone Number',
  phonePlaceholder: '+62',
  emailLabel: 'Email',
  emailPlaceholder: 'yourname@company.com',
  submit: 'Create Account',
  google: 'or Continue with Google',
  haveAccount: 'Already have an account?',
  login: 'Login',
}

/* ---------- inferred copy, matching the design's voice ---------- */
export const otpScreen = {
  title: 'Verify your email',
  titlePhone: 'Verify your phone',
  sentTo: 'We sent a 6-digit code to',
  codePrompt: 'Didn’t receive the code?',
  resend: 'Request code again',
  changeEmail: 'Wrong email address?',
  changeEmailAction: 'Change email',
  changePhone: 'Wrong phone number?',
  changePhoneAction: 'Change phone',
  verify: 'Verify',
}

export const basicInfo = {
  title: 'Tell us about you',
  subtitle: 'This helps us set up your catalogue and match you with the right buyers.',
  wrongDetails: 'Signed up with the wrong email or phone?',
  startOver: 'Start over',
  submit: 'Continue',
}

export const accountCreated = {
  title: 'Account created',
  subtitle:
    'Your LINKZ account is ready. Next, complete your business profile to unlock the catalogue and financing.',
  cta: 'Continue to KYC',
}

export const login = {
  title: 'Welcome back to LINKZ',
  subtitle: 'Log in to your catalogue, orders and financing.',
  noAccount: 'New to LINKZ?',
  createAccount: 'Create Account',
  sendCode: 'Send Code',
  submit: 'Login',
  attemptsCopy: (n: number) => `${n} attempt${n === 1 ? '' : 's'} left`,
}

export const countries = [
  { value: 'id', label: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { value: 'sg', label: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { value: 'my', label: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { value: 'ph', label: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { value: 'th', label: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { value: 'vn', label: 'Vietnam', dial: '+84', flag: '🇻🇳' },
]

export const industries = [
  { value: 'fmcg', label: 'FMCG & Groceries' },
  { value: 'fnb', label: 'Food & Beverage' },
  { value: 'pharma', label: 'Pharmacy & Health' },
  { value: 'building', label: 'Building Materials' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel & Textiles' },
  { value: 'agri', label: 'Agriculture' },
  { value: 'other', label: 'Other (please specify)' },
]

export const businessTypes = [
  {
    value: 'personal',
    label: 'Personal / Sole proprietor',
    description: 'Trading under your own name, no company registration yet.',
  },
  {
    value: 'established',
    label: 'Established business',
    description: 'Registered entity with an NPWP / business licence.',
  },
]

export const banks = [
  { value: 'bca', label: 'Bank Central Asia (BCA)' },
  { value: 'bri', label: 'Bank Rakyat Indonesia (BRI)' },
  { value: 'mandiri', label: 'Bank Mandiri' },
  { value: 'bni', label: 'Bank Negara Indonesia (BNI)' },
  { value: 'cimb', label: 'CIMB Niaga' },
  { value: 'permata', label: 'Permata Bank' },
  { value: 'danamon', label: 'Bank Danamon' },
]

export const employeeCounts = [
  { value: '1-5', label: '1–5 employees' },
  { value: '6-20', label: '6–20 employees' },
  { value: '21-50', label: '21–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '200+', label: 'More than 200' },
]

export const monthlyRevenue = [
  { value: '<100m', label: 'Under Rp 100 million' },
  { value: '100-500m', label: 'Rp 100–500 million' },
  { value: '500m-1b', label: 'Rp 500 million – 1 billion' },
  { value: '1-5b', label: 'Rp 1–5 billion' },
  { value: '5b+', label: 'Above Rp 5 billion' },
]

export const kycSteps = [
  { id: 'business', label: 'Business Overview' },
  { id: 'bank', label: 'Bank Account Details' },
  { id: '2fa', label: 'Two-Factor Authentication' },
  { id: 'review', label: 'Review & Submit' },
]

/* ---------- in-app (Get Started dashboard, node 4001:77356) ---------- */
export const currentUser = {
  name: 'Andi Wijaya',
  company: 'Sinar Jaya Trading',
  email: 'andi@sinarjaya.co.id',
  initials: 'AW',
}

export const welcomeModal = {
  title: 'Welcome to LINKZ',
  subtitle:
    'Finish these four tasks to unlock your catalogue, invite buyers and apply for financing.',
  cta: 'Get Started',
}

export const getStarted = {
  title: 'Get your account ready',
  subtitle: 'Complete each step to start trading and unlock working-capital financing.',
  tasks: [
    {
      id: 'kyc',
      icon: 'building',
      title: 'Complete your business profile',
      description: 'Tell us who you are and what you trade so we can verify your account.',
      cta: 'Start KYC',
      done: false,
    },
    {
      id: 'bank',
      icon: 'bank',
      title: 'Add a bank account',
      description: 'Where settlements and financing disbursements will land.',
      cta: 'Add account',
      done: false,
    },
    {
      id: 'catalogue',
      icon: 'file-check',
      title: 'Upload your catalogue',
      description: 'Import a spreadsheet of SKUs and prices, or add products by hand.',
      cta: 'Upload',
      done: false,
    },
    {
      id: 'invite',
      icon: 'mail',
      title: 'Invite your buyers',
      description: 'Send an invite so partners can order straight from your catalogue.',
      cta: 'Invite',
      done: false,
    },
  ],
}

export const sidebarNav = [
  { id: 'home', icon: 'building', label: 'Home' },
  { id: 'catalogue', icon: 'file-check', label: 'Catalogue' },
  { id: 'orders', icon: 'mail', label: 'Orders' },
  { id: 'financing', icon: 'bank', label: 'Financing' },
  { id: 'partners', icon: 'phone', label: 'Partners' },
]

export const kycSubmitted = {
  title: 'Your details are with our team',
  subtitle:
    'We are reviewing your business profile. Verification usually takes one working day — we will email you at',
  meanwhile: 'In the meantime you can upload your catalogue and invite buyers.',
  cta: 'Back to Get Started',
}

export const twoFactor = {
  title: 'Secure your account',
  subtitle: 'Add a second step at login so only you can approve orders and financing.',
  howItWorks: 'How two-factor authentication works',
  steps: [
    'We send a 6-digit code to your verified email or phone.',
    'You enter the code whenever you log in from a new device.',
    'Anyone with only your password still cannot get in.',
  ],
  verified: 'Two-factor authentication is on',
  verifiedSub: 'You will be asked for a code when logging in from a new device.',
}
