import { NavLink } from 'react-router-dom'
import './Navigation.css'

const Navigation = ({ isMobile, isOpen, onClose }) => {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  if (isMobile) {
    return (
      <>
        <div 
          className={`navigation__overlay ${isOpen ? 'navigation__overlay--visible' : ''}`}
          onClick={onClose}
          aria-hidden="true"
        />
        <nav 
          id="mobile-navigation"
          className={`navigation navigation--mobile ${isOpen ? 'navigation--open' : ''}`}
          aria-label="Main navigation"
        >
          <button 
            className="navigation__close" 
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ×
          </button>
          <ul className="navigation__list" role="list">
            {navLinks.map((link) => (
              <li key={link.path} role="listitem">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `navigation__link ${isActive ? 'navigation__link--active' : ''}`
                  }
                  onClick={handleLinkClick}
                  end={link.path === '/'}
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </>
    )
  }

  return (
    <nav className="navigation" aria-label="Main navigation">
      <ul className="navigation__list" role="list">
        {navLinks.map((link) => (
          <li key={link.path} role="listitem">
            <NavLink
              to={link.path}
              className={({ isActive }) => 
                `navigation__link ${isActive ? 'navigation__link--active' : ''}`
              }
              end={link.path === '/'}
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
