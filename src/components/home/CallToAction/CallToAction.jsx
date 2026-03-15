import { useNavigate } from 'react-router-dom'
import Button from '../../common/Button/Button'
import './CallToAction.css'

function CallToAction() {
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/appointment')
  }

  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-content">
          <h2 id="cta-title" className="cta-title">Ready to Take Care of Your Health?</h2>
          <p className="cta-text">
            Schedule an appointment with our experienced medical professionals today. 
            We're here to provide you with the best healthcare services.
          </p>
          <Button 
            variant="primary" 
            onClick={handleBookAppointment}
            aria-label="Book your appointment now with our medical professionals"
          >
            Book Your Appointment Now
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
