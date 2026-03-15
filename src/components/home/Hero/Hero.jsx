import { useNavigate } from 'react-router-dom'
import Button from '../../common/Button/Button'
import './Hero.css'

function Hero() {
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/appointment')
  }

  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-content">
        <h1 className="hero-title">Your Health, Our Priority</h1>
        <p className="hero-tagline">
          Providing compassionate, quality healthcare services to our community with state-of-the-art facilities and experienced medical professionals.
        </p>
        <Button 
          variant="primary" 
          onClick={handleBookAppointment}
          aria-label="Book an appointment with our healthcare professionals"
        >
          Book an Appointment
        </Button>
      </div>
    </section>
  )
}

export default Hero
