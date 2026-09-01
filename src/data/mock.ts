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

/* ---------- from Figma (nodes 4001:76466, 4001:76532) ---------- */
export const otpScreen = {
  title: 'Verify Account',
  sentToEmail: 'We’ve sent a 6-digit OTP to your email ',
  sentToPhone: 'We’ve sent a 6-digit OTP to your phone ',
  /** Placeholder identity used in the Figma frames. */
  sampleEmail: 'sanders@linkzasia.com',
  samplePhone: '(+62)811-1509-265',
  codePrompt: 'Didn’t receive the code?',
  resend: 'Request code again ',
  resendLeft: (n: number) => `(${n} left)`,
  wrongEmail: 'Wrong email? Go back or',
  changeEmail: 'Change email',
  wrongPhone: 'Wrong phone? Go back or',
  changePhone: 'Change phone',
}

export const basicInfo = {
  title: 'Basic Information',
  subtitle: 'Help us know who’s behind this account so we can personalize your experience.',
  fullName: { label: 'Full Name', placeholder: 'Your Full Name' },
  country: { label: 'Country', placeholder: 'Select a country' },
  address: { label: 'Address', placeholder: ' Address' },
  state: { label: 'State/Province', placeholder: 'Select a state', sample: 'DKI Jakarta' },
  postal: { label: 'Postal Code', placeholder: 'Postal Code', sample: '12345' },
  referral: { label: 'Referral (Optional)', placeholder: 'Referral Code' },
  learn: { label: 'How did you learn about us?', placeholder: 'Select an option' },
  wrongDetails: 'Signed up with the wrong email or phone?',
  startOver: 'Start Over',
  submit: 'Continue',
}

export const states = [
  { value: 'dki', label: 'DKI Jakarta' },
  { value: 'jabar', label: 'Jawa Barat' },
  { value: 'jateng', label: 'Jawa Tengah' },
  { value: 'jatim', label: 'Jawa Timur' },
  { value: 'banten', label: 'Banten' },
  { value: 'bali', label: 'Bali' },
  { value: 'sumut', label: 'Sumatera Utara' },
]

export const learnOptions = [
  { value: 'friend', label: 'Friend or colleague' },
  { value: 'social', label: 'Social media' },
  { value: 'search', label: 'Search engine' },
  { value: 'event', label: 'Event or exhibition' },
  { value: 'sales', label: 'LINKZ sales team' },
  { value: 'other', label: 'Other' },
]

/* ---------- inferred copy, matching the design's voice ---------- */
export const benefit = {
  title: 'Do more with LINKZ',
  subtitle:
    'Complete your KYC to accept payments, receive payouts, and access financing, all in one place.',
  cards: [
    {
      icon: 'card',
      title: 'Accept payments',
      description: 'Get paid by customers directly through LINKZ.',
    },
    {
      icon: 'bank',
      title: 'Get payouts',
      description: 'Withdraw your earnings straight to your bank.',
    },
    {
      icon: 'coins',
      title: 'Access financing',
      description: 'Get working capital once your business is verified.',
    },
  ],
  checklistTitle: 'What you’ll need — have these ready before you start',
  checklist: [
    { label: 'Business overview', note: '· NPWP, NIB' },
    { label: 'Authorized representative details' },
    { label: 'Bank account details' },
    { label: '2-Factor Authentication' },
  ],
  duration: 'About 5-10 minutes',
  saveNote:
    'Set aside a few minutes and have your documents ready. Your progress isn’t saved, so you’ll need to complete KYC in one go.',
  primaryCta: 'Continue to KYC',
  secondaryCta: 'Skip for now',
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


export const banks = [
  { value: 'bca', label: 'Bank Central Asia (BCA)' },
  { value: 'bri', label: 'Bank Rakyat Indonesia (BRI)' },
  { value: 'mandiri', label: 'Bank Mandiri' },
  { value: 'bni', label: 'Bank Negara Indonesia (BNI)' },
  { value: 'cimb', label: 'CIMB Niaga' },
  { value: 'permata', label: 'Permata Bank' },
  { value: 'danamon', label: 'Bank Danamon' },
]



/* ---------- KYC (nodes 4001:84233, 4001:84868, 4001:84939) ---------- */
export const kycNav = {
  progressLabel: 'Verification progress',
  afterKyc: 'After KYC',
  sections: [
    { id: 'business', label: 'Business Overview' },
    { id: 'bank', label: 'Bank Account Details' },
  ],
  afterItems: [{ id: '2fa', label: '2-Factor Authentication' }],
  inProgress: 'In Progress',
  skipNote: 'If you skip, everything you’ve filled in will be cleared.',
  skip: 'Skip for now',
}

export const kycBusiness = {
  sectionLabel: 'KYC Section 1 of 2',
  title: 'Business Overview',
  continueCta: 'Continue',
  intro: 'Tell us about your business. This determines which documents we’ll need from you.',
  uploadAlert: {
    prefix: 'All uploads accept',
    formats: ' JPEG, PNG, PDF, DOC',
    middle: ' · max ',
    size: '10 MB',
    suffix: '. Names must match across your KTP, NPWP, and bank account.',
  },
  fields: {
    registration: {
      label: 'Company registration',
      hint: 'Determines which documents needed to complete verification.',
      value: 'Personal Business (no Deed of Establishment)',
    },
    companyName: {
      label: 'Company name',
      hint: 'The name you operate under. ',
      placeholder: 'Type in company name',
      help: 'You can use your own name if you don’t have a separate company name.',
    },
    industry: {
      label: 'Industry',
      hint: 'The primary sector your business operates in.',
      placeholder: 'Choose the business industry',
    },
    companySize: {
      label: 'Company size',
      hint: 'The approximate number of people working in your business.',
      placeholder: 'Select a range',
    },
    address: {
      label: 'Business Address',
      hint: 'The main address where your business operates.',
      placeholder: 'Type in company address',
      state: 'State/Province',
      postal: 'Postal Code',
    },
  },
  uploads: [
    { id: 'ktp', label: 'Personal ID', hint: 'Your government-issued identity card.' },
    { id: 'npwp', label: 'Personal NPWP', hint: 'Your personal tax identification number.' },
    { id: 'nib', label: 'Personal NIB', hint: 'Your business registration number.' },
  ],
  uploadCta: 'Upload File',
  uploadHint: 'JPEG, PNG, PDF, DOC · Max 10 MB',
  registrationWarning: {
    title: 'Change business registration?',
    body: 'Changing your business registration clears everything you have filled in on this form, because a different registration needs a different set of documents. You will need to enter your details again.',
    confirm: 'Change and clear',
    cancel: 'Keep my answers',
  },
}

/**
 * Company registration — the verification path branches on whether the business
 * has a Deed of Establishment, so this is a two-way choice, not a list of legal
 * forms. (The legal forms CV / PT / PT Perorangan / Firma all fall under
 * "Established Business" and are collected later in the KYC flow.)
 */
export const registrationTypes = [
  { value: 'personal', label: 'Personal Business (no Deed of Establishment)' },
  { value: 'established', label: 'Established Business (has Deed of Establishment)' },
]

export const companySizes = [
  { value: '1-5', label: '1 - 5' },
  { value: '6-20', label: '6 - 20' },
  { value: '21-50', label: '21 - 50' },
  { value: '51-200', label: '51 - 200' },
  { value: '200+', label: 'More than 200' },
]

/* ---------- in-app: Get Started dashboard (node 4001:77356) ---------- */
export const currentUser = {
  /** Greeting name used in the dashboard header frame. */
  greetingName: 'Sanders',
  /** Profile shown in the sidebar footer. */
  name: 'Dheana Titaura',
  role: 'Business Owner',
  email: 'sanders@linkzasia.com',
  initials: 'DT',
}

export const welcomeModal = {
  title: 'Welcome to LINKZ!',
  subtitle:
    'Your account is ready. You can pick up your unfinished KYC anytime from the Get Started to unlock more features.',
  cta: 'Get Started',
}

export const getStarted = {
  greeting: (name: string) => `Welcome, ${name}`,
  title: 'Get Started with LINKZ',
  subtitleLine1: 'Set up your account and start getting the most out of LINKZ.',
  subtitleLine2: 'This page will be available until you complete all the steps.',
  progress: (done: number, total: number) => `${done}/${total} Completed`,
  notStarted: 'Not Started',
  completed: 'Completed',
  tasks: [
    {
      id: 'kyc',
      title: 'Verify Your Business',
      description:
        'Submit your business details to enable payments, financing, and other key features.',
      cta: 'Verify Business',
    },
    {
      id: 'data',
      title: 'Upload Your Business Data',
      description: 'Add products, inventory, or customer data to get started faster on LINKZ.',
      cta: 'Extract Data',
    },
    {
      id: 'order',
      title: 'Create Your First Order',
      description:
        'Experience how ordering works on LINKZ from request to payment in one flow.',
      cta: 'Create Order',
    },
    {
      id: 'team',
      title: 'Invite Your Team',
      description:
        'Collaborate with your team by assigning roles and managing access together.',
      cta: 'Invite Teammates',
    },
  ],
}

/**
 * Success popups (KYC complete, 2FA complete, first entry). All three auto-close
 * after ~7s and carry a dismiss icon — see `SuccessPopup`.
 */
export const successPopups = {
  'kyc-complete': {
    icon: 'circle-check',
    title: 'KYC submitted',
    body: 'Your business details are with our team. Verification usually takes one working day, and we will email you as soon as it is done.',
    cta: 'Continue',
  },
  'two-factor-complete': {
    icon: 'shield',
    title: 'Two-factor authentication is on',
    body: 'From now on you will confirm a 6-digit code when you log in and when you approve orders or financing.',
    cta: 'Done',
  },
  welcome: {
    icon: 'rocket',
    title: 'Welcome to LINKZ!',
    body: 'Your account is ready. You can pick up anything you have not finished from Get Started whenever you like.',
    cta: 'Get Started',
  },
} as const

export const sidebarNav = [
  { id: 'get-started', icon: 'house', label: 'Get Started' },
  { id: 'order', icon: 'file-check', label: 'Order' },
  { id: 'catalogue', icon: 'book', label: 'Catalogue' },
  { id: 'manage', icon: 'user-cog', label: 'Manage' },
  { id: 'finance', icon: 'banknote', label: 'Finance' },
]

export const sidebarFooter = {
  supportLabel: 'Support',
  email: 'support@linkzasia.com',
  phone: '(62)811-1509-265',
  logout: 'Logout',
}

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
