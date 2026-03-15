import Hero from '../components/home/Hero/Hero'
import ServicesOverview from '../components/home/ServicesOverview/ServicesOverview'
import CallToAction from '../components/home/CallToAction/CallToAction'

function HomePage() {
  return (
    <div className="page home-page">
      <Hero />
      <ServicesOverview />
      <CallToAction />
    </div>
  )
}

export default HomePage
