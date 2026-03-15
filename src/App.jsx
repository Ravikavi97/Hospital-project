import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppointmentProvider } from './context/AppointmentContext'
import { ToastProvider } from './context/ToastContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'
import ToastContainer from './components/common/ToastContainer/ToastContainer'

// Code splitting: lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'))

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppointmentProvider>
          <Router>
            <a href="#main-content" className="skip-to-main">
              Skip to main content
            </a>
            <div className="app">
              <Header />
              <main id="main-content" className="main-content">
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/appointment" element={<AppointmentPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </Router>
        </AppointmentProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
