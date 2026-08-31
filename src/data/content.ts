/**
 * All copy and mock data for the Linkz v4 landing prototype lives here.
 * Nothing in this file is fetched — swap the strings and the page re-skins itself.
 */

export const site = {
  name: 'Linkz',
  version: 'v4',
  tagline: 'One network for buyers and suppliers',
  email: 'hello@linkz.example',
}

export const nav = {
  links: [
    { label: 'Platform', href: '#platform' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Customers', href: '#customers' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: { label: 'Book a demo', href: '#cta' },
  secondaryCta: { label: 'Sign in', href: '#cta' },
}

export const hero = {
  eyebrow: 'Linkz v4 is here',
  eyebrowNote: 'Multi-warehouse inventory + AI order capture',
  title: 'Every order, every supplier,',
  titleAccent: 'on one connected line.',
  subtitle:
    'Linkz replaces the WhatsApp threads, PDF price lists and re-keyed spreadsheets between you and your trading partners. Shared catalogues, live order status, and stock that stays in sync — without ripping out the ERP you already run.',
  primaryCta: { label: 'Book a demo', href: '#cta' },
  secondaryCta: { label: 'See how it works', href: '#how-it-works' },
  footnote: 'No credit card. 14-day sandbox with sample data.',
}

export const logos = [
  'NORTHWIND FOODS',
  'Kaisen Metals',
  'Tanjong Supply Co.',
  'BRIGHTLEAF',
  'Merapi Trading',
  'ORIONPACK',
  'Selat Logistics',
  'Halcyon Chem',
]

export const stats = [
  { value: '18,400+', label: 'Trading partners connected' },
  { value: '$2.6B', label: 'Order value processed annually' },
  { value: '73%', label: 'Less time spent on order entry' },
  { value: '4.2 hrs', label: 'Average quote turnaround, down from 2 days' },
]

export type Feature = {
  id: string
  title: string
  description: string
  icon: 'catalogue' | 'orders' | 'inventory' | 'insights' | 'partners' | 'automation'
  bullets: string[]
}

export const features: Feature[] = [
  {
    id: 'catalogue',
    title: 'Living catalogues',
    description:
      'Publish one catalogue with customer-specific pricing tiers. Update a price once and every buyer sees it the moment it takes effect — no more stale PDFs in someone’s inbox.',
    icon: 'catalogue',
    bullets: ['Per-customer price tiers', 'Scheduled price changes', 'Bulk CSV & ERP import'],
  },
  {
    id: 'orders',
    title: 'Orders that capture themselves',
    description:
      'Buyers order from your catalogue, or forward the PO exactly as they always have. Linkz reads emailed PDFs and chat messages and drafts the order for your team to confirm.',
    icon: 'orders',
    bullets: ['PDF & email PO parsing', 'Chat-to-order capture', 'One-tap confirm or amend'],
  },
  {
    id: 'inventory',
    title: 'Inventory in sync',
    description:
      'Multi-warehouse stock levels, allocations and incoming shipments in one view. Commit only what you can actually ship, and flag shortfalls before the buyer chases you.',
    icon: 'inventory',
    bullets: ['Multi-warehouse view', 'Soft allocations', 'Low-stock alerts'],
  },
  {
    id: 'partners',
    title: 'A shared partner record',
    description:
      'Every partner gets one record: terms, contacts, price tier, credit limit and full order history. Your sales rep and their procurement lead look at the same page.',
    icon: 'partners',
    bullets: ['Shared order timeline', 'Credit & terms tracking', 'Role-based access'],
  },
  {
    id: 'automation',
    title: 'Rules, not chasing',
    description:
      'Reorder reminders, payment-due nudges and delivery updates go out on their own. Your team steps in when something is genuinely exceptional.',
    icon: 'automation',
    bullets: ['Reorder reminders', 'Payment-due nudges', 'Exception queue'],
  },
  {
    id: 'insights',
    title: 'Insight without a data team',
    description:
      'See which SKUs are slipping, which buyers are ordering less than last quarter, and where margin is quietly leaking — from data you already generate.',
    icon: 'insights',
    bullets: ['Buyer churn signals', 'SKU velocity', 'Margin by customer'],
  },
]

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Live in a fortnight, not a fiscal year',
  subtitle:
    'Linkz sits on top of the way your team already trades. Most customers run their first real order through the platform inside two weeks.',
  steps: [
    {
      step: '01',
      title: 'Bring your catalogue',
      description:
        'Upload a spreadsheet, or point Linkz at your ERP export. We map SKUs, units and price tiers with you, then you approve the result.',
      duration: 'Day 1–2',
    },
    {
      step: '02',
      title: 'Invite your partners',
      description:
        'Send invites to the buyers and suppliers you already trade with. They join free — no seat licence, no procurement cycle on their side.',
      duration: 'Day 3–5',
    },
    {
      step: '03',
      title: 'Route orders through Linkz',
      description:
        'Orders arrive by portal, email or chat and land in one queue. Your team confirms; the buyer sees status update in real time.',
      duration: 'Week 2',
    },
    {
      step: '04',
      title: 'Turn on the automations',
      description:
        'Switch on reorder reminders, stock alerts and payment nudges once the basics are humming. Nothing fires until you say so.',
      duration: 'Ongoing',
    },
  ],
}

export const testimonials = [
  {
    quote:
      'We were re-typing 300 order lines a day out of WhatsApp and email. Linkz took that to about twenty exceptions. Two of my ops people moved onto account work instead.',
    name: 'Priya Raman',
    role: 'Head of Operations',
    company: 'Northwind Foods',
    initials: 'PR',
  },
  {
    quote:
      'Our buyers stopped calling to ask where their order was, because they can just see it. That alone paid for the year.',
    name: 'Marcus Teo',
    role: 'Commercial Director',
    company: 'Kaisen Metals',
    initials: 'MT',
  },
  {
    quote:
      'I expected a six-month rollout. We ran our first live order on day nine, and the ERP never had to change.',
    name: 'Dewi Sanjaya',
    role: 'Supply Chain Lead',
    company: 'Merapi Trading',
    initials: 'DS',
  },
]

export type Plan = {
  id: string
  name: string
  blurb: string
  monthly: number | null
  annual: number | null
  priceNote: string
  cta: string
  featured: boolean
  features: string[]
}

export const pricing: { plans: Plan[]; note: string } = {
  note: 'Buyers always join free. You only pay for the side of the network that sells.',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      blurb: 'For a single team getting off spreadsheets.',
      monthly: 249,
      annual: 199,
      priceNote: 'per month, up to 5 seats',
      cta: 'Start free trial',
      featured: false,
      features: [
        'Up to 5 seats',
        '1 warehouse',
        'Shared catalogue & price tiers',
        'Order portal for unlimited buyers',
        'Email support',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      blurb: 'For distributors running real volume across sites.',
      monthly: 749,
      annual: 599,
      priceNote: 'per month, up to 25 seats',
      cta: 'Book a demo',
      featured: true,
      features: [
        'Everything in Starter',
        'Up to 25 seats, unlimited warehouses',
        'AI order capture from PDF & chat',
        'Automations & exception queue',
        'ERP + accounting sync',
        'Priority support, 4-hour response',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      blurb: 'For groups trading across borders and entities.',
      monthly: null,
      annual: null,
      priceNote: 'Custom pricing',
      cta: 'Talk to sales',
      featured: false,
      features: [
        'Everything in Growth',
        'Multi-entity & multi-currency',
        'SSO / SAML & audit logs',
        'Custom integrations & API limits',
        'Named customer engineer',
        '99.9% uptime SLA',
      ],
    },
  ],
}

export const faqs = [
  {
    q: 'Do our suppliers and buyers have to pay?',
    a: 'No. Partners you invite join free and get the full ordering, status and document experience. Linkz is billed on the selling side only, so onboarding a partner never involves their procurement team.',
  },
  {
    q: 'Do we have to replace our ERP?',
    a: 'No — and we would rather you did not. Linkz sits in front of your ERP and syncs orders, customers and stock levels both ways. Most customers keep their existing system of record untouched.',
  },
  {
    q: 'How accurate is the AI order capture?',
    a: 'On typical purchase orders it drafts the line items correctly around 95% of the time. Every draft still goes to a human for confirmation — Linkz never posts an order your team has not seen.',
  },
  {
    q: 'What does implementation actually involve?',
    a: 'A catalogue import, a mapping review with your team, and partner invites. There is no on-site install. Most customers process their first live order within two weeks of kickoff.',
  },
  {
    q: 'Where is our data stored?',
    a: 'In the region you choose at signup — Singapore, Frankfurt or Virginia. Data is encrypted at rest and in transit, and you can export everything you have put in at any time.',
  },
  {
    q: 'Can we trial it with real orders?',
    a: 'Yes. The 14-day trial starts as a sandbox with sample data, and you can promote it to live whenever your team is ready. Nothing is sent to a partner until you invite them.',
  },
]

export const finalCta = {
  title: 'See Linkz running on your own catalogue',
  subtitle:
    'Send us a price list and a handful of recent orders. We will load them into a private sandbox and walk your team through it — 30 minutes, no slides.',
  primaryCta: 'Book a demo',
  secondaryCta: 'Start free trial',
  reassurance: ['30-minute walkthrough', 'Your own data, private sandbox', 'No credit card'],
}

export const footer = {
  blurb: 'The trading network for buyers, suppliers and everyone in between.',
  columns: [
    {
      title: 'Platform',
      links: ['Catalogues', 'Order capture', 'Inventory', 'Automations', 'Insights'],
    },
    { title: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'] },
    { title: 'Resources', links: ['Docs', 'API reference', 'Changelog', 'Status', 'Security'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Data processing', 'Sub-processors'] },
  ],
  legal: 'Fictional company, fictional numbers — this is a prototype.',
}

/* ---------- Mock data for the in-hero product preview ---------- */

export type MockOrder = {
  id: string
  partner: string
  initials: string
  items: number
  value: string
  status: 'Confirmed' | 'Awaiting stock' | 'Draft from email' | 'In transit' | 'Delivered'
  eta: string
}

export const mockOrders: MockOrder[] = [
  {
    id: 'PO-40917',
    partner: 'Northwind Foods',
    initials: 'NF',
    items: 24,
    value: '$18,420',
    status: 'Confirmed',
    eta: 'Ships Thu',
  },
  {
    id: 'PO-40916',
    partner: 'Selat Logistics',
    initials: 'SL',
    items: 8,
    value: '$4,180',
    status: 'Draft from email',
    eta: 'Needs review',
  },
  {
    id: 'PO-40914',
    partner: 'Kaisen Metals',
    initials: 'KM',
    items: 61,
    value: '$96,700',
    status: 'Awaiting stock',
    eta: '2 lines short',
  },
  {
    id: 'PO-40911',
    partner: 'Brightleaf',
    initials: 'BL',
    items: 12,
    value: '$7,905',
    status: 'In transit',
    eta: 'Arrives Wed',
  },
  {
    id: 'PO-40908',
    partner: 'Merapi Trading',
    initials: 'MT',
    items: 33,
    value: '$21,640',
    status: 'Delivered',
    eta: 'Signed 09:14',
  },
]

export const mockSummary = [
  { label: 'Open orders', value: '128', delta: '+12 today', trend: 'up' as const },
  { label: 'Needs review', value: '6', delta: '3 from email', trend: 'flat' as const },
  { label: 'Value in flight', value: '$412k', delta: '+8.4% wk', trend: 'up' as const },
]

/** Weekly order volume for the sparkline in the preview card. */
export const mockVolume = [18, 26, 22, 34, 30, 44, 39, 52, 48, 61, 57, 72]
