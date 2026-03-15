import ServiceCard from '../ServiceCard/ServiceCard'
import './ServicesOverview.css'

function ServicesOverview() {
  const services = [
    {
      id: 1,
      icon: '❤️',
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options for all cardiac conditions.'
    },
    {
      id: 2,
      icon: '👶',
      title: 'Pediatrics',
      description: 'Specialized care for infants, children, and adolescents with a focus on preventive health.'
    },
    {
      id: 3,
      icon: '🦴',
      title: 'Orthopedics',
      description: 'Expert treatment for bone, joint, and muscle conditions using the latest surgical techniques.'
    },
    {
      id: 4,
      icon: '🧠',
      title: 'Neurology',
      description: 'Advanced care for neurological disorders including stroke, epilepsy, and movement disorders.'
    },
    {
      id: 5,
      icon: '👁️',
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine exams to advanced surgical procedures.'
    },
    {
      id: 6,
      icon: '🦷',
      title: 'Dentistry',
      description: 'Full-service dental care including preventive, restorative, and cosmetic dentistry.'
    }
  ]

  return (
    <section className="services-overview" aria-labelledby="services-title">
      <div className="container">
        <h2 id="services-title" className="services-overview-title">Our Medical Services</h2>
        <p className="services-overview-subtitle">
          Comprehensive healthcare services delivered by experienced professionals
        </p>
        <div className="services-grid" role="list">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesOverview
