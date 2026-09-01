/**
 * Mock data for the four in-app areas of the V.4 Compilation file
 * (Figma `eX8Lc53tVFuY2QEDW4t1QT`): general features, finance and account
 * management. Onboarding copy stays in `mock.ts`.
 *
 * Labels, column headings, tab names and button text were read off the frame
 * renders for the node IDs cited on each block. Table rows are invented in the
 * design's own voice — the frames show one to three sample rows and these lists
 * extend that pattern so tables, pagination and empty states have something to
 * show. Nothing here is real: no backend, no API, no payment processing.
 *
 * Page node IDs for every area are recorded in FIGMA-PAGES.md.
 */

/* ---------- shared chrome (from Figma, nodes 4001:113931, 4033:50119) ---------- */

export const appNav = [
  { id: 'get-started', icon: 'rocket', label: 'Get Started' },
  { id: 'dashboard', icon: 'layout-grid', label: 'Dashboard' },
  { id: 'order', icon: 'file-check', label: 'Order', expandable: true },
  { id: 'catalogue', icon: 'book', label: 'Catalogue', expandable: true },
  { id: 'finance', icon: 'card', label: 'Finance', expandable: true },
  { id: 'manage', icon: 'user-cog', label: 'Manage', expandable: true },
]

/** Sub-items under each expandable nav group — from the sidebar in every frame. */
export const appSubNav: Record<string, { id: string; label: string }[]> = {
  order: [
    { id: 'sales-orders', label: 'Sales Order' },
    { id: 'purchase-orders', label: 'Purchase Order' },
    { id: 'order-report', label: 'Order Report' },
  ],
  catalogue: [
    { id: 'my-catalogue', label: 'My Catalogue' },
    { id: 'shared-catalogue', label: 'Shared with me' },
    { id: 'master-products', label: 'Master Products' },
  ],
  finance: [
    { id: 'spl', label: 'Seller Pay Later' },
    { id: 'bpl', label: 'Buyer Pay Later' },
    { id: 'bizloan', label: 'Biz Loan' },
  ],
  manage: [
    { id: 'profile', label: 'My Profile' },
    { id: 'employees', label: 'My Employee' },
    { id: 'contacts', label: 'Business Contact' },
    { id: 'referrals', label: 'Referral' },
  ],
}

/**
 * Where each sidebar group lands when its label is clicked. Points at the
 * built screen in that section, not necessarily the first sub-item —
 * Catalogue's first entry (My Catalogue) is outside the built happy path.
 */
export const navLanding: Record<string, string> = {
  order: 'sales-orders',
  catalogue: 'master-products',
  finance: 'spl',
  manage: 'profile',
}

export const topBar = {
  getStartedLabel: 'Get Started',
  getStartedProgress: '1/3',
  companyLabel: 'Your Company:',
  company: 'LINKZ IN JOGJA',
  language: 'English',
  back: 'Back',
}

/** Pagination strip — from Figma, e.g. node 4001:13925. */
export const pager = {
  show: 'Show',
  perPage: (noun: string) => `${noun} per page`,
  goToPage: 'Go to page',
  of: 'of 1',
  sizes: ['10', '25', '50'],
}

export const filters = {
  newest: 'Newest',
  allType: 'All Type',
  allStatus: 'All Status',
  allCategory: 'All Category',
  allCatalogues: 'All Catalogues',
  allRoles: 'All Roles',
}

/* ---------- 1. Dashboard (from Figma, node 4001:113931) ---------- */

export const dashboard = {
  title: 'Dashboard',
  periods: [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
    { id: 'year', label: 'This year' },
  ],
  sortBy: 'Sort by:',
  sections: {
    overview: 'OVERVIEW',
    performance: 'PERFORMANCE',
    order: 'ORDER',
    finance: 'FINANCE ACTIVITY',
    intelligence: 'BUSINESS INTELLIGENCE',
  },
  bgf: {
    title: 'Biz Growth Fund',
    status: 'Active',
    subtitle: 'Available credit limit · shared between SPL and BPL',
    amount: 'IDR 20.000.000',
    of: 'of IDR 20.000.000 total limit',
    availableLabel: 'Available',
    available: 'IDR 20.000.000',
    usedLabel: 'Used',
    used: 'IDR 0',
  },
  eligibility: {
    title: 'Finance Eligibility',
    status: 'Qualified',
    subtitle: 'Your progress toward unlocking finance features',
    items: [
      { label: 'Payment Gateway', unlocked: true },
      { label: 'Seller Pay Later', unlocked: false },
      { label: 'Buyer Pay Later', unlocked: false },
    ],
    progressLabel: 'Documents submission',
    progress: '10/10',
  },
  payable: {
    title: 'Total Payable',
    subtitle: 'The total amount you still owe your suppliers',
    amount: 'IDR 3.000.000',
  },
  receivable: {
    title: 'Total Receivable',
    subtitle: 'Total amount customers still owe you',
    amount: 'IDR 8.500.000',
  },
  settlements: {
    title: 'Latest Settlements',
    subtitle: 'Most recent funds settled to your bank account',
    amount: 'IDR 4.500.000',
    nextLabel: 'Next settlement:',
    nextDate: '20 Jul 2026',
    nextAmount: 'IDR 1.000.000',
  },
  financialSummary: {
    title: 'Financial summary',
    subtitle: 'Revenue, spending and profit this period',
    rows: [
      {
        label: 'Total Revenue',
        value: 'IDR 120.000.000',
        tone: 'positive' as const,
        delta: '20%',
        deltaDir: 'up' as const,
        vs: 'vs last month IDR 100.000.000',
      },
      {
        label: 'Total Spending',
        value: 'IDR 80.000.000',
        tone: 'warning' as const,
        delta: '14.3%',
        deltaDir: 'down' as const,
        vs: 'vs last month IDR 70.000.000',
      },
    ],
    profitLabel: 'Gross Profit',
    margin: 'Margin 33.3%',
    profit: 'IDR 40.000.000',
    profitDelta: '25%',
    profitVs: 'vs last month IDR 30.000.000',
  },
  salesTrend: {
    title: 'Sales Trend',
    subtitle: 'Revenue performance this period',
    bestLabel: 'Best week',
    bestRange: '14 - 20 Jun 2026',
    bestValue: 'IDR 32.000.000',
    slowestLabel: 'Slowest week',
    slowestRange: '1 - 6 Jun 2026',
    slowestValue: 'IDR 4.000.000',
    averageLabel: 'Weekly average',
    average: 'IDR 20.000.000',
    averageDelta: '20%',
    averageVs: 'vs last month IDR 17.000.000',
    yAxis: ['1 Mill', '500K', '100K', '50K', '10K', '0'],
    xAxis: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    /** Normalised 0–1 series driving the inline SVG sparkline. */
    series: [0.08, 0.34, 0.38, 0.36, 0.2, 0.46, 0.52, 0.38, 0.62, 0.7, 0.24, 0.58, 0.82, 0.9],
    tooltip: { label: 'Revenue', value: 'IDR 32.000.000', range: '14 - 20 Jun 2026' },
    activePoint: 'Week 3',
  },
  orderWidgets: [
    {
      id: 'sales',
      icon: 'file-check',
      title: 'Total Sales Order',
      subtitle: 'Direct orders from your customers',
      amount: 'IDR 5.000.000',
      invoiced: '8',
      completed: '5',
    },
    {
      id: 'catalogue',
      icon: 'book',
      title: 'Total Catalogue Order',
      subtitle: 'Orders via your shared catalogue',
      amount: 'IDR 1.000.000',
      invoiced: '2',
      completed: '1',
    },
    {
      id: 'gmv',
      icon: 'package',
      title: 'Total Gross Merchandise Value',
      subtitle: 'Combined sales and catalogue orders',
      amount: 'IDR 6.000.000',
      invoiced: '10',
      completed: '6',
    },
    {
      id: 'purchase',
      icon: 'truck',
      title: 'Total Purchase Order',
      subtitle: 'Orders placed with your suppliers',
      amount: 'IDR 1.000.000',
      invoiced: '1',
      completed: '1',
    },
  ],
  invoicedLabel: 'Invoiced',
  completedLabel: 'Completed',
  splOverview: {
    title: 'Seller Pay Later Overview',
    subtitle: 'Total SPL claimed this period',
    amount: 'IDR 0',
    stats: [
      { label: 'Approved', value: '0' },
      { label: 'Pending', value: '0' },
      { label: 'Rejected', value: '0' },
    ],
  },
  bplOverview: {
    title: 'Buyer Pay Later Overview',
    subtitle: 'Total orders paid using BPL this period',
    amount: 'IDR 0',
    stats: [
      { label: 'Repaid', value: '0' },
      { label: 'Outstanding', value: '0' },
    ],
  },
  topCustomers: {
    title: 'Top Customers',
    subtitle: 'Ranked by total order value this period',
    columns: ['#', 'Customer', 'Value'],
    rows: [
      { name: 'PT Maju Bersama', value: 'IDR 300.000', bar: 1 },
      { name: 'CV Sejahtera Jaya', value: 'IDR 200.000', bar: 0.68 },
      { name: 'Toko Budi Online', value: 'IDR 100.000', bar: 0.34 },
      { name: 'UD Karya Mandiri', value: 'IDR 100.000', bar: 0.34 },
      { name: 'PT Indo Sukses', value: 'IDR 50.000', bar: 0.16 },
    ],
  },
  topProducts: {
    title: 'Top Products',
    subtitle: 'Ranked by total revenue this period',
    columns: ['#', 'Product', 'Value', 'Unit Sold'],
    rows: [
      { name: 'Product A', value: 'IDR 400.000', units: '4', bar: 1 },
      { name: 'Product B', value: 'IDR 200.000', units: '10', bar: 0.5 },
      { name: 'Product C', value: 'IDR 100.000', units: '1', bar: 0.25 },
      { name: 'Product D', value: 'IDR 10.000', units: '1', bar: 0.1 },
      { name: 'Product E', value: 'IDR 5000', units: '50', bar: 0.06 },
    ],
  },
}

/* ---------- 2. Order Management (from Figma, nodes 4001:13925, 4001:11308) ---------- */

export const salesOrders = {
  breadcrumb: ['Order', 'Sales Order'],
  title: 'Sales Order',
  buttons: { report: 'Order Report', upload: 'Upload Order', create: 'Create Order' },
  searchPlaceholder: 'Search orders',
  perPageNoun: 'order',
  columns: [
    'No.',
    'Order No.',
    'Created By',
    'Bill to',
    'Paid Amount',
    'Grand Total Amount',
    'Invoice',
    'Last Updated',
    'Status',
    '',
  ],
  emptyTitle: 'No orders yet',
  emptyBody: 'Orders you create will show up here.',
  rows: [
    {
      no: '150725-0000001',
      isNew: true,
      createdBy: 'LINKZ Asia Jogja',
      billTo: 'LINKZ Asia Jogja',
      paid: 'IDR 1.000.000.000,00',
      total: 'IDR 1.000.000,00',
      invoice: '1',
      updated: '5 Feb 2026 06:00 AM',
      status: 'Invoiced',
    },
    {
      no: '150725-0000002',
      isNew: false,
      createdBy: 'LINKZ Asia Jogja',
      billTo: 'PT Maju Bersama',
      paid: 'IDR 3.200.000,00',
      total: 'IDR 3.200.000,00',
      invoice: '1',
      updated: '4 Feb 2026 09:12 AM',
      status: 'Paid',
    },
    {
      no: '150725-0000003',
      isNew: false,
      createdBy: 'Rizky Pratama',
      billTo: 'CV Sejahtera Jaya',
      paid: 'IDR 0,00',
      total: 'IDR 1.850.000,00',
      invoice: '—',
      updated: '3 Feb 2026 14:38 PM',
      status: 'Confirmed',
    },
    {
      no: '150725-0000004',
      isNew: false,
      createdBy: 'Rizky Pratama',
      billTo: 'Toko Budi Online',
      paid: 'IDR 0,00',
      total: 'IDR 940.000,00',
      invoice: '—',
      updated: '2 Feb 2026 11:05 AM',
      status: 'Draft',
    },
  ],
}

export const purchaseOrders = {
  breadcrumb: ['Order', 'Purchase Order'],
  title: 'Purchase Order',
  buttons: { report: 'Order Report', upload: 'Upload Order', create: 'Create Order' },
  searchPlaceholder: 'Search orders',
  perPageNoun: 'order',
  columns: [
    'No.',
    'Order No.',
    'Created By',
    'Bill from',
    'Paid Amount',
    'Grand Total Amount',
    'Invoice',
    'Last Updated',
    'Status',
    '',
  ],
  emptyTitle: 'No purchase orders yet',
  emptyBody: 'Orders you place with your suppliers will show up here.',
  rows: [
    {
      no: '150725-0000061',
      isNew: true,
      createdBy: 'LINKZ Asia Jogja',
      billTo: 'PT Sumber Pangan',
      paid: 'IDR 0,00',
      total: 'IDR 1.000.000,00',
      invoice: '—',
      updated: '5 Feb 2026 08:20 AM',
      status: 'Sent',
    },
    {
      no: '150725-0000060',
      isNew: false,
      createdBy: 'Sari Wulandari',
      billTo: 'CV Anugerah Jaya',
      paid: 'IDR 2.450.000,00',
      total: 'IDR 2.450.000,00',
      invoice: '1',
      updated: '1 Feb 2026 16:44 PM',
      status: 'Paid',
    },
    {
      no: '150725-0000059',
      isNew: false,
      createdBy: 'Sari Wulandari',
      billTo: 'PT Bahan Baku Nusantara',
      paid: 'IDR 780.000,00',
      total: 'IDR 780.000,00',
      invoice: '1',
      updated: '28 Jan 2026 10:02 AM',
      status: 'Completed',
    },
  ],
}

export const createOrder = {
  breadcrumb: ['Order', 'Sales Order', 'Create Order'],
  title: 'Create Order',
  sections: {
    party: 'Order Information',
    items: 'Order Items',
    summary: 'Order Summary',
  },
  customerLabel: 'Bill to',
  customerHelp: 'The customer this order is billed to.',
  customerPlaceholder: 'Select a customer',
  orderNoLabel: 'Order No.',
  orderNo: '150725-0000005',
  orderDateLabel: 'Order Date',
  orderDate: '2026-02-05',
  dueDateLabel: 'Due Date',
  dueDate: '2026-02-19',
  currencyLabel: 'Base Currency',
  currency: 'IDR',
  referenceLabel: 'Reference No.',
  referencePlaceholder: 'Optional',
  itemColumns: ['No.', 'Product', 'Qty', 'Base Price', 'Discount', 'Total', ''],
  addItem: 'Add Item',
  notesLabel: 'Notes',
  notesPlaceholder: 'Add a note for this order',
  summary: {
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax (11%)',
    total: 'Grand Total Amount',
  },
  saveDraft: 'Save as Draft',
  submit: 'Send Order',
  cancel: 'Cancel',
  sentTitle: 'Order sent',
  sentBody:
    'Your order has been sent to the customer. You can track its status from the Sales Order list.',
  sentCta: 'Back to Sales Order',
  customers: [
    'PT Maju Bersama',
    'CV Sejahtera Jaya',
    'Toko Budi Online',
    'UD Karya Mandiri',
    'PT Indo Sukses',
  ],
}

export const orderItems = [
  {
    product: 'White Cotton T-Shirt',
    sku: 'SKU12345678',
    qty: '4',
    price: 'IDR 100.000,00',
    discount: 'IDR 0,00',
    total: 'IDR 400.000,00',
  },
  {
    product: 'Black Denim Jeans',
    sku: 'SKU12345679',
    qty: '10',
    price: 'IDR 20.000,00',
    discount: 'IDR 0,00',
    total: 'IDR 200.000,00',
  },
  {
    product: 'Red Hoodie',
    sku: 'SKU12345680',
    qty: '1',
    price: 'IDR 100.000,00',
    discount: 'IDR 0,00',
    total: 'IDR 100.000,00',
  },
]

export const orderTotals = {
  subtotal: 'IDR 700.000,00',
  discount: 'IDR 0,00',
  tax: 'IDR 77.000,00',
  total: 'IDR 777.000,00',
}

/* ---------- 4. Master Product (from Figma, node 4033:50119) ---------- */

export const masterProducts = {
  breadcrumb: ['Catalogue', 'Master Products'],
  title: 'Master Products',
  buttons: { export: 'Export / Import', create: 'Create Product' },
  searchPlaceholder: 'Search product',
  perPageNoun: 'products',
  columns: [
    '',
    'No.',
    'Product Name',
    'Base Currency',
    'Base Price',
    'Category',
    'Catalogues',
    '',
  ],
  emptyTitle: 'No products yet',
  emptyBody: 'Create your first product to start building your catalogue.',
  categories: ['Shirt', 'Pants', 'Sweater', 'Shoes', 'Jacket', 'Accessory'],
  rows: [
    { name: 'White Cotton T-Shirt', sku: 'SKU12345678', isNew: true, currency: 'IDR', price: '1.000.000.000,00', category: 'Shirt', catalogues: '1' },
    { name: 'Black Denim Jeans', sku: 'SKU12345679', isNew: true, currency: 'IDR', price: '750.000.000,00', category: 'Pants', catalogues: '2' },
    { name: 'Red Hoodie', sku: 'SKU12345680', isNew: true, currency: 'IDR', price: '900.000.000,00', category: 'Sweater', catalogues: '1' },
    { name: 'Blue Sneakers', sku: 'SKU12345681', isNew: false, currency: 'IDR', price: '1.500.000.000,00', category: 'Shoes', catalogues: '3' },
    { name: 'Green Windbreaker', sku: 'SKU12345682', isNew: false, currency: 'IDR', price: '600.000.000,00', category: 'Jacket', catalogues: '2' },
    { name: 'Yellow Beanie', sku: 'SKU12345683', isNew: false, currency: 'IDR', price: '150.000.000,00', category: 'Accessory', catalogues: '5' },
    { name: 'Purple Scarf', sku: 'SKU12345684', isNew: false, currency: 'IDR', price: '200.000.000,00', category: 'Accessory', catalogues: '4' },
    { name: 'Brown Belt', sku: 'SKU12345686', isNew: false, currency: 'IDR', price: '250.000.000,00', category: 'Accessory', catalogues: '6' },
    { name: 'Leather Wallet', sku: 'SKU12345687', isNew: false, currency: 'IDR', price: '150.000.000,00', category: 'Accessory', catalogues: '15' },
    { name: 'Silk Scarf', sku: 'SKU12345688', isNew: false, currency: 'IDR', price: '350.000.000,00', category: 'Accessory', catalogues: '20' },
  ],
  form: {
    breadcrumb: ['Catalogue', 'Master Products', 'Create Product'],
    title: 'Create Product',
    detailsSection: 'Product Details',
    imageLabel: 'Product image',
    imageHelp: 'JPEG, PNG or GIF · Max 2 MB · Recommended 1000 x 1000px',
    upload: 'Upload Photo',
    name: 'Product Name',
    namePlaceholder: 'e.g. White Cotton T-Shirt',
    sku: 'SKU',
    skuPlaceholder: 'e.g. SKU12345678',
    category: 'Category',
    categoryPlaceholder: 'Select a category',
    description: 'Description',
    descriptionPlaceholder: 'Describe this product for your catalogue',
    pricingSection: 'Pricing',
    currency: 'Base Currency',
    price: 'Base Price',
    pricePlaceholder: '0,00',
    stockSection: 'Stock',
    stock: 'Opening Stock',
    minStock: 'Minimum Stock Alert',
    save: 'Create Product',
    cancel: 'Cancel',
  },
}

/* ---------- Finance: Seller Pay Later (from Figma, node 4001:187533) ---------- */

export const spl = {
  breadcrumb: ['Finance', 'Seller Pay Later'],
  title: 'Seller Pay Later',
  limitCard: {
    title: 'Seller Pay Later',
    subtitle: 'Remaining available credit (shared with BPL)',
    amount: 'IDR 20.000.000',
    of: '/ IDR 20.000.000',
  },
  billsCard: {
    title: 'Seller Pay Later Bills',
    amount: 'IDR 0',
    body: 'There is no active bills on your',
    bodyStrong: 'Seller Pay Later',
    cta: 'Make Repayment',
  },
  tabs: [
    { id: 'claim', label: 'Claim SPL' },
    { id: 'requests', label: 'SPL Requests' },
    { id: 'billings', label: 'SPL Billings' },
    { id: 'history', label: 'Billing History' },
    { id: 'bpl-orders', label: 'BPL Orders' },
  ],
  searchPlaceholder: 'Search request',
  perPageNoun: 'request',
  columns: [
    'No.',
    'Order Number',
    'Request Date',
    'Last Updated',
    'Amount Payout',
    'Status',
    'Download Invoice',
  ],
  emptyTitle: 'No requests yet',
  emptyBody: 'Claim early payment on an unpaid invoice and it will appear here.',
  rows: [
    {
      order: '20225-0000001',
      requested: '5 June 2026 06:00 AM',
      updated: '5 June 2026 06:00 AM',
      payout: 'IDR 15.000,00',
      status: 'Processing',
    },
    {
      order: '20225-0000002',
      requested: '4 June 2026 06:00 AM',
      updated: '5 June 2026 06:00 AM',
      payout: 'IDR 15.000,00',
      status: 'Approved',
    },
    {
      order: '20225-0000003',
      requested: '3 June 2026 06:00 AM',
      updated: '5 June 2026 06:00 AM',
      payout: 'IDR 15.000,00',
      status: 'Rejected',
    },
  ],
  claim: {
    title: 'Claim early payment',
    body: 'Choose a confirmed sales order your customer has not paid yet. Approved claims are disbursed to your account, minus the financing fee.',
    orderLabel: 'Order Number',
    orderPlaceholder: 'Select an unpaid order',
    amountLabel: 'Invoice amount',
    amount: 'IDR 15.000,00',
    feeLabel: 'Financing fee (3%)',
    fee: 'IDR 450,00',
    payoutLabel: 'Amount payout',
    payout: 'IDR 14.550,00',
    accountLabel: 'Disbursed to',
    account: 'VIMA Bank · 8808 1509 2650 4471',
    submit: 'Submit Claim',
    submittedTitle: 'Claim submitted',
    submittedBody:
      'We are reviewing your claim. Approved claims are disbursed within one working day.',
  },
  download: 'Download',
}

/* ---------- Finance: Buyer Pay Later (from Figma, node 4001:198717) ---------- */

export const bpl = {
  breadcrumb: ['Finance', 'Buyer Pay Later'],
  title: 'Buyer Pay Later',
  limitCard: {
    title: 'Buyer Pay Later',
    subtitle: 'Remaining available credit (shared with SPL)',
    amount: 'IDR 20.000.000',
    of: '/ IDR 20.000.000',
  },
  billsCard: {
    title: 'Buyer Pay Later Bills',
    amount: 'IDR 0',
    body: 'There is no active bills on your',
    bodyStrong: 'Buyer Pay Later',
    cta: 'Make Repayment',
  },
  tabs: [
    { id: 'billings', label: 'BPL Billings' },
    { id: 'history', label: 'Billing History' },
    { id: 'orders', label: 'BPL Orders' },
  ],
  searchPlaceholder: 'Search bill',
  perPageNoun: 'bill',
  columns: [
    'No.',
    'Bill Number',
    'Order Number',
    'Billed Date',
    'Due Date',
    'Amount',
    'Status',
    'Download Invoice',
  ],
  emptyTitle: 'No bills yet',
  emptyBody: 'Pay for an order with Buyer Pay Later and the bill will appear here.',
  rows: [
    {
      bill: 'BPL-20225-0031',
      order: '150725-0000061',
      billed: '16 June 2026 06:00 AM',
      due: '15 July 2026',
      amount: 'IDR 1.000.000,00',
      status: 'Outstanding',
    },
    {
      bill: 'BPL-20225-0030',
      order: '150725-0000060',
      billed: '12 June 2026 06:00 AM',
      due: '11 July 2026',
      amount: 'IDR 2.450.000,00',
      status: 'Outstanding',
    },
    {
      bill: 'BPL-20225-0029',
      order: '150725-0000059',
      billed: '8 May 2026 06:00 AM',
      due: '7 June 2026',
      amount: 'IDR 780.000,00',
      status: 'Repaid',
    },
  ],
  download: 'Download',
}

/* ---------- Finance: Biz Loan (from Figma, node 4001:204677) ---------- */

export const bizLoan = {
  breadcrumb: ['Finance', 'Biz Loan'],
  title: 'Biz Loan',
  bannerTitle: 'Get the funding your business needs.',
  bannerBody: 'Apply for a business loan through LINKZ and get connected to our partner banks.',
  howTitle: 'How Biz Loan works',
  steps: [
    {
      title: 'Submit your application',
      body: 'Apply through LINKZ with your business documents. Once approved, Biz Loan and other financing features will be activated on your account.',
    },
    {
      title: 'We review your application',
      body: 'Your documents are reviewed by our team. We may reach out if additional information is needed.',
    },
    {
      title: 'Receive your funds',
      body: 'Once approved, funds are disbursed directly to your account. Disbursement timeline may vary depending on the loan type.',
    },
  ],
  tipsTitle: 'Tips to improve your approval chances',
  tips: [
    {
      title: 'Stay active on LINKZ',
      body: 'Keep creating and completing transactions regularly. A consistent track record strengthens your application.',
    },
    {
      title: 'Use LINKZ payments',
      body: 'Pay through the LINKZ payment gateway to help verify your transaction history and payment behaviour.',
    },
  ],
  partner: 'In partnership with VIMA Bank · Supervised by OJK (Otoritas Jasa Keuangan)',
  applyCta: 'Apply Now',
}

/* ---------- Account: My Profile (from Figma, node 4001:222163) ---------- */

export const profile = {
  breadcrumb: ['My Profile', 'Account Information'],
  sectionsLabel: 'My Profile sections',
  sections: [
    { id: 'profile', label: 'Account Information' },
    { id: 'address-book', label: 'Address Book' },
    { id: 'company-list', label: 'Company List' },
  ],
  title: 'Account Information',
  cancel: 'Cancel',
  save: 'Save Changes',
  picture: {
    label: 'Profile picture',
    help: 'Shown on your profile and next to your name across the platform.',
    rules: ['JPEG, PNG or GIF', 'Max 2 MB', 'Recommended dimension 2000 x 2000px'],
    upload: 'Upload Photo',
  },
  fields: [
    {
      id: 'fullName',
      label: 'Full name',
      help: 'Shown on your profile and used to verify your identity.',
      value: 'Dheana Titaura',
      readOnly: false,
    },
    {
      id: 'role',
      label: 'Role',
      help: 'Assigned based on your company creation.\nContact support to change your role.',
      value: 'Business Owner',
      readOnly: true,
      note: 'This field is set automatically and cannot be edited here.',
    },
    {
      id: 'country',
      label: 'Country',
      help: 'Determines your default currency and regional settings.\nContact support to update.',
      value: 'Indonesia',
      readOnly: true,
      note: 'Country is set at sign-up and cannot be edited here.',
    },
    {
      id: 'email',
      label: 'Email address',
      help: 'Used to log in and receive important account notifications.\nContact support to change verified email.',
      value: 'Dheana@email.com',
      readOnly: false,
      action: 'Verify Now',
      note: 'Changes won’t take effect until you verify the new email.',
      warning: 'Your email address is not verified yet',
    },
    {
      id: 'phone',
      label: 'Phone number',
      help: 'Used to log in and receive important account notifications via WhatsApp.\nContact support to change verified phone number.',
      value: '+62 81234567890',
      readOnly: true,
      verified: 'Verified',
    },
  ],
}

export const addressBook = {
  breadcrumb: ['My Profile', 'Address Book'],
  title: 'Address Book',
  subtitle: 'Delivery and billing addresses used on your orders.',
  create: 'Add Address',
  searchPlaceholder: 'Search address',
  perPageNoun: 'address',
  columns: ['No.', 'Label', 'Recipient', 'Address', 'Type', ''],
  emptyTitle: 'No addresses yet',
  emptyBody: 'Add a delivery or billing address to use it on your orders.',
  primaryBadge: 'Primary',
  rows: [
    {
      label: 'Main Warehouse',
      recipient: 'Dheana Titaura',
      address: 'Jl. Malioboro No. 52, Yogyakarta, DI Yogyakarta 55213',
      type: 'Shipping',
      primary: true,
    },
    {
      label: 'Head Office',
      recipient: 'Dheana Titaura',
      address: 'Jl. Sudirman No. 12, Yogyakarta, DI Yogyakarta 55224',
      type: 'Billing',
      primary: false,
    },
    {
      label: 'Store — Solo',
      recipient: 'Rizky Pratama',
      address: 'Jl. Slamet Riyadi No. 88, Surakarta, Jawa Tengah 57131',
      type: 'Shipping',
      primary: false,
    },
  ],
  form: {
    title: 'Add Address',
    label: 'Address Label',
    labelPlaceholder: 'e.g. Main Warehouse',
    recipient: 'Recipient Name',
    recipientPlaceholder: 'Who receives the delivery',
    phone: 'Recipient Phone',
    phonePlaceholder: '+62',
    street: 'Street Address',
    streetPlaceholder: 'Street name, building, unit',
    city: 'City',
    cityPlaceholder: 'Select a city',
    province: 'Province',
    provincePlaceholder: 'Select a province',
    postal: 'Postal Code',
    postalPlaceholder: '00000',
    type: 'Address Type',
    types: ['Shipping', 'Billing'],
    setPrimary: 'Set as primary address',
    save: 'Save Address',
    cancel: 'Cancel',
  },
  cities: ['Yogyakarta', 'Surakarta', 'Semarang', 'Jakarta Selatan', 'Bandung'],
  provinces: ['DI Yogyakarta', 'Jawa Tengah', 'DKI Jakarta', 'Jawa Barat'],
}

export const companyList = {
  breadcrumb: ['My Profile', 'Company List'],
  title: 'Company List',
  subtitle: 'Businesses you own or belong to on LINKZ.',
  create: 'Add Company',
  searchPlaceholder: 'Search company',
  perPageNoun: 'company',
  columns: ['No.', 'Company', 'Registration No.', 'Role', 'KYC Status', ''],
  emptyTitle: 'No companies yet',
  emptyBody: 'Add a company to start trading under it.',
  rows: [
    {
      name: 'LINKZ IN JOGJA',
      reg: '09.876.543.2-109.000',
      role: 'Business Owner',
      status: 'Verified',
    },
    {
      name: 'Toko Sinar Jaya',
      reg: '08.765.432.1-098.000',
      role: 'Business Owner',
      status: 'Under Review',
    },
    { name: 'CV Rejeki Abadi', reg: '—', role: 'Staff', status: 'Unregistered' },
  ],
}

/* ---------- Account: My Employee (from Figma, node 4001:246556) ---------- */

export const employees = {
  breadcrumb: ['Manage', 'My Employee'],
  title: 'My Employee',
  subtitle: 'Invite teammates and control what they can do on LINKZ.',
  create: 'Invite Employee',
  searchPlaceholder: 'Search employee',
  perPageNoun: 'employee',
  columns: ['No.', 'Name', 'Email', 'Role', 'Status', 'Joined', ''],
  emptyTitle: 'No employees yet',
  emptyBody: 'Invite your first teammate to collaborate on orders and catalogue.',
  roles: ['Business Owner', 'Finance', 'Sales', 'Warehouse', 'Staff'],
  rows: [
    {
      name: 'Dheana Titaura',
      email: 'dheana@linkzasia.com',
      role: 'Business Owner',
      status: 'Active',
      joined: '2 Jan 2026',
    },
    {
      name: 'Rizky Pratama',
      email: 'rizky@linkzasia.com',
      role: 'Sales',
      status: 'Active',
      joined: '14 Feb 2026',
    },
    {
      name: 'Sari Wulandari',
      email: 'sari@linkzasia.com',
      role: 'Finance',
      status: 'Active',
      joined: '3 Mar 2026',
    },
    {
      name: 'Bagus Nugroho',
      email: 'bagus@linkzasia.com',
      role: 'Warehouse',
      status: 'Invited',
      joined: '—',
    },
  ],
  form: {
    title: 'Invite Employee',
    name: 'Full Name',
    namePlaceholder: 'Your teammate’s name',
    email: 'Email',
    emailPlaceholder: 'name@company.com',
    role: 'Role',
    rolePlaceholder: 'Select a role',
    permissionsSection: 'Permissions',
    permissions: [
      { id: 'orders', label: 'Create and manage orders' },
      { id: 'catalogue', label: 'Manage catalogue and products' },
      { id: 'finance', label: 'Access finance and payouts' },
      { id: 'team', label: 'Invite and manage employees' },
    ],
    send: 'Send Invite',
    cancel: 'Cancel',
    sentTitle: 'Invite sent',
    sentBody: 'We emailed the invite. They will appear as Active once they accept.',
  },
}

/* ---------- Account: Business Contact (from Figma, node 4001:253744) ---------- */

export const contacts = {
  breadcrumb: ['Manage', 'Business Contact'],
  title: 'Business Contact',
  subtitle: 'The customers and suppliers you trade with on LINKZ.',
  create: 'Add Contact',
  searchPlaceholder: 'Search contact',
  perPageNoun: 'contact',
  tabs: [
    { id: 'customers', label: 'Customers' },
    { id: 'suppliers', label: 'Suppliers' },
  ],
  columns: ['No.', 'Company', 'Contact Person', 'Email', 'Phone', 'Linked', ''],
  emptyTitle: 'No contacts yet',
  emptyBody: 'Add a customer or supplier to start trading with them.',
  linked: 'Linked',
  notLinked: 'Not on LINKZ',
  customers: [
    {
      company: 'PT Maju Bersama',
      person: 'Andi Wijaya',
      email: 'andi@majubersama.co.id',
      phone: '(+62)812-3456-7890',
      linked: true,
    },
    {
      company: 'CV Sejahtera Jaya',
      person: 'Lina Kusuma',
      email: 'lina@sejahterajaya.co.id',
      phone: '(+62)813-2345-6789',
      linked: true,
    },
    {
      company: 'Toko Budi Online',
      person: 'Budi Santoso',
      email: 'budi@tokobudi.id',
      phone: '(+62)814-1234-5678',
      linked: false,
    },
    {
      company: 'UD Karya Mandiri',
      person: 'Dewi Anggraini',
      email: 'dewi@karyamandiri.id',
      phone: '(+62)815-9876-5432',
      linked: false,
    },
  ],
  suppliers: [
    {
      company: 'PT Sumber Pangan',
      person: 'Hendra Gunawan',
      email: 'hendra@sumberpangan.co.id',
      phone: '(+62)816-1122-3344',
      linked: true,
    },
    {
      company: 'CV Anugerah Jaya',
      person: 'Maya Sari',
      email: 'maya@anugerahjaya.co.id',
      phone: '(+62)817-5566-7788',
      linked: true,
    },
    {
      company: 'PT Bahan Baku Nusantara',
      person: 'Eko Prasetyo',
      email: 'eko@bbnusantara.co.id',
      phone: '(+62)818-9900-1122',
      linked: false,
    },
  ],
  form: {
    title: 'Add Contact',
    typeLabel: 'Contact Type',
    types: [
      { id: 'customer', label: 'Customer' },
      { id: 'supplier', label: 'Supplier' },
    ],
    company: 'Company Name',
    companyPlaceholder: 'Registered business name',
    person: 'Contact Person',
    personPlaceholder: 'Who you deal with',
    email: 'Email',
    emailPlaceholder: 'name@company.com',
    phone: 'Phone Number',
    phonePlaceholder: '+62',
    address: 'Address',
    addressPlaceholder: 'Street name, building, unit',
    save: 'Save Contact',
    cancel: 'Cancel',
  },
}

/* ---------- Account: Referrals (from Figma, node 4001:263130) ---------- */

export const referrals = {
  breadcrumb: ['Manage', 'Referral'],
  title: 'Referrals',
  howTitle: 'How it works',
  howSubtitle: 'Invite others to LINKZ and earn rewards when they get started.',
  steps: [
    {
      title: 'Share your referral link or code',
      body: 'Send your referral link or share your referral code with anyone you want to invite to LINKZ.',
    },
    {
      title: 'They sign up with your referral',
      body: 'Your code is applied automatically if they use your link, or they can enter it manually when signing up.',
    },
    {
      title: 'Earn your reward',
      body: 'Your referral is complete once they make their first transaction on LINKZ.',
    },
  ],
  linkLabel: 'Your referral link',
  linkSubtitle: 'Share this link to invite others. Your code is included automatically.',
  link: 'https://linkzasia.com/r/DHEANA-8241',
  orCopy: 'Or copy the code for others to enter manually when signing up.',
  codeLabel: 'Your referral code',
  codeSubtitle: 'Others can enter this manually when signing up.',
  code: 'DHEANA-8241',
  copy: 'Copy',
  copied: 'Copied',
  historyTitle: 'Your referral history',
  historySubtitle: 'Track everyone you’ve invited and see the status of each referral.',
  searchPlaceholder: 'Search referral',
  perPageNoun: 'referral',
  columns: ['No.', 'Name', 'Email', 'Referred On', 'Status'],
  emptyTitle: 'No referrals yet',
  emptyBody: 'Share your link or code and the people you invite will appear here.',
  tabs: [
    { id: 'how', label: 'How it works' },
    { id: 'history', label: 'Referral History' },
  ],
  /** From the designer's note on node 4001:263982. */
  statusNote:
    'A referral status remains as Pending until the referred user completes their first transaction using the LINKZ payment gateway. Once the transaction is confirmed, the status automatically updates to Completed.',
  rows: [
    {
      name: 'Andi Wijaya',
      email: 'andi@majubersama.co.id',
      date: '12 June 2026',
      status: 'Completed',
    },
    {
      name: 'Lina Kusuma',
      email: 'lina@sejahterajaya.co.id',
      date: '5 June 2026',
      status: 'Pending',
    },
  ],
}

/* ---------- Checkout (from Figma, node 4001:18536) ---------- */

export const checkout = {
  breadcrumb: ['Purchase Order', 'Order Details', 'Checkout'],
  shippingTitle: 'Shipping Destination',
  sellerTitle: 'Seller Information',
  summaryTitle: 'Order Summary',
  buyer: {
    company: 'LINKZ Asia Jogja',
    person: 'Dheana Titaura',
    phone: '+62 8310123456789',
    email: 'Dheana@email.com',
    addressLabel: 'My Office',
    addressPerson: 'Dheana Titaura',
    addressPhone: '+62 8310123456789',
    address:
      'Gg. Masjid Albarokah, Dusun Mudal, Karang Moko, Sariharjo, Ngaglik, Sleman, DI Yogyakarta',
    newAddress: 'New Address',
    changeAddress: 'Change Address',
  },
  seller: {
    company: 'KFC Indonesia Co., Ltd.',
    person: 'Sanders',
    phone: '+62 8310123456789',
    email: 'Sanders@kfc.com',
    addressLabel: 'Office',
    addressPerson: 'Colonel Sanders',
    addressPhone: '+62 8310123456789',
    address:
      '16th floor - T9, APL Tower, Podomoro City (Central Park) Jl. Let. Jend. S. Parman, Kav 28 Jakarta 11470, Indonesia',
  },
  paymentTitle: 'Payment Method',
  paymentSubtitle: 'Please choose what payment method that you want to use.',
  methods: [
    {
      id: 'cards',
      icon: 'card',
      label: 'Cards Payment (Credit / Debit)',
      description: 'Pay with Visa, Mastercard, or JCB cards.',
      options: [
        {
          id: 'bri',
          label: 'BRI',
          description: 'Pay with the official LINKZ partner for seamless payment processing.',
        },
        {
          id: 'local',
          label: 'Local Cards',
          description: 'Pay with cards issued by other Indonesian banks.',
        },
        {
          id: 'foreign',
          label: 'Foreign Cards',
          description: 'Pay with card issued outside Indonesia.',
        },
      ],
    },
    {
      id: 'qris',
      icon: 'layout-grid',
      label: 'QRIS',
      description: 'Scan QRIS to complete your payment.',
    },
    {
      id: 'transfer',
      icon: 'arrow-right',
      label: 'Bank Transfer',
      description: 'Pay via virtual account from your selected bank.',
      options: [
        { id: 'vima', label: 'VIMA Bank', description: 'Virtual account 8808 1509 2650 4471.' },
        { id: 'bca', label: 'BCA', description: 'Virtual account 7011 1509 2650 4471.' },
      ],
    },
    {
      id: 'offline',
      icon: 'banknote',
      label: 'Offline Payment',
      description: 'Pay directly to the seller after order confirmation.',
    },
  ],
  item: {
    name: 'Hazmat Suit',
    sku: 'SKU-001',
    qty: 'Qty: 1',
    unit: 'IDR 1.000.000,00',
    total: 'IDR 1.000.000,00',
  },
  summary: {
    subtotal: 'Subtotal',
    subtotalValue: 'IDR 1.000.000,00',
    delivery: 'Delivery Fee',
    deliveryValue: 'IDR 0,00',
    discount: 'Additional Discount',
    discountValue: '(IDR 0,00)',
    taxes: 'Taxes',
    taxesValue: 'IDR 0,00',
    payable: 'Payable Amount',
    payableValue: 'IDR 1.000.000,00',
  },
  totalLabel: 'Total:',
  totalValue: 'IDR 1.000.000,00',
  proceed: 'Proceed Payment',
  paidTitle: 'Payment received',
  paidBody:
    'We have received your payment and notified the seller. The order moves to Paid on the order list.',
  paidCta: 'Back to Purchase Order',
}

/* ---------- shared ---------- */

export const common = {
  notBuiltTitle: 'Not part of this mock',
  notBuiltBody:
    'This screen exists in the Figma file but is outside the happy path built for training. Pick another item from the sidebar.',
}
