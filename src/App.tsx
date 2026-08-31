import { FlowProvider } from './prototype/flow'
import { useFlow } from './prototype/flowContext'
import { ScreenSwitcher } from './prototype/ScreenSwitcher'
import { BasicInfo } from './screens/auth/BasicInfo'
import { CreateAccount } from './screens/auth/CreateAccount'
import { GoogleAuth } from './screens/auth/GoogleAuth'
import { Login } from './screens/auth/Login'
import { Otp } from './screens/auth/Otp'
import { GetStarted } from './screens/app/GetStarted'
import { KycBankAccount, KycBusinessOverview, KycSubmitted, KycTwoFactor } from './screens/app/Kyc'

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
    default:
      return <CreateAccount />
  }
}

export default function App() {
  return (
    <FlowProvider>
      <CurrentScreen />
      <ScreenSwitcher />
    </FlowProvider>
  )
}
