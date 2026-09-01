import { FlowProvider } from './prototype/flow'
import { SessionProvider } from './prototype/session'
import { useFlow } from './prototype/flowContext'
import { ScreenSwitcher } from './prototype/ScreenSwitcher'
import { BasicInfo } from './screens/auth/BasicInfo'
import { CreateAccount } from './screens/auth/CreateAccount'
import { GoogleAuth } from './screens/auth/GoogleAuth'
import { Login } from './screens/auth/Login'
import { Benefit } from './screens/auth/Benefit'
import { Otp } from './screens/auth/Otp'
import { GetStarted } from './screens/app/GetStarted'
import { KycBankAccount, KycSubmitted, KycTwoFactor } from './screens/app/Kyc'
import { KycBusinessOverview } from './screens/app/KycBusinessOverview'
import { Dashboard } from './screens/app/Dashboard'
import { CreateOrder, PurchaseOrders, SalesOrders } from './screens/app/Orders'
import { CreateProduct, MasterProducts } from './screens/app/Products'
import { BizLoan, BuyerPayLater, SellerPayLater } from './screens/app/Finance'
import {
  AddressBook,
  CompanyList,
  Contacts,
  Employees,
  Profile,
  Referrals,
} from './screens/app/Account'
import { NotBuilt } from './screens/app/NotBuilt'
import { Checkout } from './screens/app/Checkout'

function CurrentScreen() {
  const { screen } = useFlow()
  switch (screen) {
    case 'create-account':
      return <CreateAccount />
    case 'otp-email':
      return <Otp channel="email" />
    case 'otp-phone':
      return <Otp channel="phone" />
    case 'basic-info':
      return <BasicInfo />
    case 'account-created':
      return <BasicInfo showCreated />
    case 'benefit':
      return <Benefit />
    case 'login':
      return <Login />
    case 'google-auth':
      return <GoogleAuth />
    case 'get-started':
      return <GetStarted />
    case 'kyc-business':
      return <KycBusinessOverview />
    case 'kyc-bank':
      return <KycBankAccount />
    case 'kyc-2fa':
      return <KycTwoFactor />
    case 'kyc-submitted':
      return <KycSubmitted />
    case 'dashboard':
      return <Dashboard />
    case 'sales-orders':
      return <SalesOrders />
    case 'purchase-orders':
      return <PurchaseOrders />
    case 'order-new':
      return <CreateOrder />
    case 'checkout':
      return <Checkout />
    case 'master-products':
      return <MasterProducts />
    case 'product-new':
      return <CreateProduct />
    case 'spl':
      return <SellerPayLater />
    case 'bpl':
      return <BuyerPayLater />
    case 'bizloan':
      return <BizLoan />
    case 'profile':
      return <Profile />
    case 'address-book':
      return <AddressBook />
    case 'company-list':
      return <CompanyList />
    case 'employees':
      return <Employees />
    case 'contacts':
      return <Contacts />
    case 'referrals':
      return <Referrals />
    case 'order-report':
      return <NotBuilt title="Order Report" activeNav="order-report" />
    case 'my-catalogue':
      return <NotBuilt title="My Catalogue" activeNav="my-catalogue" />
    case 'shared-catalogue':
      return <NotBuilt title="Shared with me" activeNav="shared-catalogue" />
    default:
      return <CreateAccount />
  }
}

export default function App() {
  return (
    <SessionProvider>
      <FlowProvider>
        <CurrentScreen />
        <ScreenSwitcher />
      </FlowProvider>
    </SessionProvider>
  )
}
