import { FeaturesClubs } from './FeaturesClubs'
import { FeaturesTechnical } from './FeaturesTechnical'
import { FinalCta } from './FinalCta'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { InfoDarkSection } from './InfoDarkSection'
import { Navbar } from './Navbar'
import { Partners } from './Partners'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#4B5563] antialiased">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <FeaturesTechnical />
        <FeaturesClubs />
        <InfoDarkSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
