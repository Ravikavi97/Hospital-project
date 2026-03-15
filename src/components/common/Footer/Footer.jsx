import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__heading">Contact Us</h3>
            <div className="footer__info">
              <p className="footer__item">
                <span className="footer__label">Address:</span>
                123 Medical Center Drive, Healthcare City, HC 12345
              </p>
              <p className="footer__item">
                <span className="footer__label">Phone:</span>
                <a href="tel:+15551234567">(555) 123-4567</a>
              </p>
              <p className="footer__item">
                <span className="footer__label">Email:</span>
                <a href="mailto:info@healthcare-hospital.com">info@healthcare-hospital.com</a>
              </p>
            </div>
          </div>

          <div className="footer__section">
            <h3 className="footer__heading">Operating Hours</h3>
            <div className="footer__info">
              <p className="footer__item">
                <span className="footer__label">Emergency:</span>
                24/7
              </p>
              <p className="footer__item">
                <span className="footer__label">Outpatient:</span>
                Mon-Fri: 8:00 AM - 6:00 PM
              </p>
              <p className="footer__item">
                <span className="footer__label">Weekend:</span>
                Sat-Sun: 9:00 AM - 4:00 PM
              </p>
            </div>
          </div>

          <div className="footer__section">
            <h3 className="footer__heading">Follow Us</h3>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <span>Facebook</span>
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <span>Twitter</span>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <span>Instagram</span>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} HealthCare Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
