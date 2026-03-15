import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../Navigation'
import Button from '../Button'
import './Header.css'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`header ${isSticky ? 'header--sticky' : ''}`} role="banner">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <Link to="/" className="header__logo-link" aria-label="HealthCare Hospital - Go to homepage">
              <div className="header__logo-icon" aria-hidden="true">+</div>
              <span className="header__logo-text">HealthCare Hospital</span>
            </Link>
          </div>

          {!isMobile && (
            <>
              <Navigation isMobile={false} />
              <Link to="/appointment" aria-label="Book an appointment">
                <Button variant="primary">
                  Book Appointment
                </Button>
              </Link>
            </>
          )}

          {isMobile && (
            <button 
              className="header__hamburger"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span className="header__hamburger-line"></span>
              <span className="header__hamburger-line"></span>
              <span className="header__hamburger-line"></span>
            </button>
          )}
        </div>
      </div>

      {isMobile && (
        <Navigation 
          isMobile={true} 
          isOpen={isMobileMenuOpen} 
          onClose={closeMobileMenu}
        />
      )}
    </header>
  )
}

export default Header
