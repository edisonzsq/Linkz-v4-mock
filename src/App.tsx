import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { LogoCloud } from './components/LogoCloud'
import { Nav } from './components/Nav'
import { Pricing } from './components/Pricing'
import { Testimonials } from './components/Testimonials'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
