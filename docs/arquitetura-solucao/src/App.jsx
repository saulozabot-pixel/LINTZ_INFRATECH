import Header from './layouts/Header'
import Footer from './layouts/Footer'
import HeroSection from './sections/HeroSection'
import ExecutiveSummarySection from './sections/ExecutiveSummarySection'
import ArchitectureSection from './sections/ArchitectureSection'
import AuthFlowSection from './sections/AuthFlowSection'
import HierarchySection from './sections/HierarchySection'
import SecuritySection from './sections/SecuritySection'
import InfrastructureSection from './sections/InfrastructureSection'
import GovernanceSection from './sections/GovernanceSection'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <HeroSection />
        <ExecutiveSummarySection />
        <ArchitectureSection />
        <AuthFlowSection />
        <HierarchySection />
        <SecuritySection />
        <InfrastructureSection />
        <GovernanceSection />
      </main>
      <Footer />
    </div>
  )
}
