import { Link } from 'react-router-dom'
import './ServiceCard.css'

function ServiceCard({ icon, title, description }) {
  return (
    <article className="service-card">
      <div className="service-icon" aria-hidden="true">{icon}</div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      <Link to="/services" className="service-link" aria-label={`Learn more about ${title}`}>
        Learn More →
      </Link>
    </article>
  )
}

export default ServiceCard
