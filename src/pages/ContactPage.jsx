import './ContactPage.css';

const INFO_CARDS = [
  {
    icon: '📍',
    color: '#10B981',
    title: 'Our Address',
    content: (
      <address>
        <p>123 Medical Center Drive</p>
        <p>Green Valley, CA 94025</p>
        <p>United States</p>
      </address>
    ),
  },
  {
    icon: '📞',
    color: '#3B82F6',
    title: 'Phone Numbers',
    content: (
      <>
        <a href="tel:+15551234567" className="contact-link">+1 (555) 123-4567</a>
        <p className="contact-detail">Main Reception</p>
        <a href="tel:+15551234911" className="contact-link">+1 (555) 123-4911</a>
        <p className="contact-detail">Emergency Line (24/7)</p>
      </>
    ),
  },
  {
    icon: '✉️',
    color: '#8B5CF6',
    title: 'Email Us',
    content: (
      <>
        <a href="mailto:info@greenvalleyhospital.com" className="contact-link">info@greenvalleyhospital.com</a>
        <p className="contact-detail">General Inquiries</p>
        <a href="mailto:appointments@greenvalleyhospital.com" className="contact-link">appointments@greenvalleyhospital.com</a>
        <p className="contact-detail">Appointment Booking</p>
      </>
    ),
  },
  {
    icon: '🕐',
    color: '#F59E0B',
    title: 'Working Hours',
    content: (
      <div className="hours-list">
        {[
          ['Emergency Dept', '24 / 7'],
          ['Outpatient', 'Mon–Fri  7 AM – 8 PM'],
          ['', 'Sat–Sun  8 AM – 5 PM'],
          ['Administration', 'Mon–Fri  8 AM – 5 PM'],
        ].map(([day, time], i) => (
          <div key={i} className="hours-row">
            <span className="hours-day">{day}</span>
            <span className="hours-time">{time}</span>
          </div>
        ))}
      </div>
    ),
  },
];

function ContactPage() {
  return (
    <main className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__inner">
          <div className="contact-hero__badge">Get In Touch</div>
          <h1>We're Here to Help</h1>
          <p>Reach out to our team for appointments, inquiries, or any support you need. We respond within 24 hours.</p>
          <div className="contact-hero__cta">
            <a href="tel:+15551234567" className="btn-hero btn-hero--primary">📞 Call Now</a>
            <a href="mailto:info@greenvalleyhospital.com" className="btn-hero btn-hero--outline">✉️ Send Email</a>
          </div>
        </div>
        <div className="contact-hero__graphic" aria-hidden="true">
          <div className="hero-circle hero-circle--1" />
          <div className="hero-circle hero-circle--2" />
          <div className="hero-circle hero-circle--3" />
          <span className="hero-emoji">🏥</span>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="contact-cards-section">
        <div className="contact-cards-grid">
          {INFO_CARDS.map(({ icon, color, title, content }) => (
            <article key={title} className="info-card" style={{ '--card-color': color }}>
              <div className="info-card__icon-wrap">
                <span className="info-card__icon">{icon}</span>
              </div>
              <h2 className="info-card__title">{title}</h2>
              <div className="info-card__body">{content}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Map + Quick Contact ── */}
      <section className="contact-bottom">
        <div className="map-wrap">
          <h2 className="section-heading">Find Us</h2>
          <div className="map-frame">
            <iframe
              title="Hospital location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.639290621064!2d-122.08374948469227!3d37.38605197982946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="map-address-pill">
            <span>📍</span> 123 Medical Center Drive, Green Valley, CA 94025
          </div>
        </div>

        <div className="quick-contact">
          <h2 className="section-heading">Quick Contact</h2>
          <form className="qc-form" onSubmit={e => e.preventDefault()}>
            <input className="qc-input" type="text" placeholder="Your Name" required />
            <input className="qc-input" type="email" placeholder="Email Address" required />
            <input className="qc-input" type="tel" placeholder="Phone Number" />
            <textarea className="qc-input qc-textarea" placeholder="How can we help you?" rows={4} required />
            <button type="submit" className="qc-submit">Send Message →</button>
          </form>
        </div>
      </section>

      {/* ── Emergency Banner ── */}
      <aside className="emergency-banner" role="complementary">
        <div className="emergency-banner__inner">
          <div className="emergency-pulse" aria-hidden="true">🚨</div>
          <div>
            <h2>Medical Emergency?</h2>
            <p>Call <strong>911</strong> immediately or visit our Emergency Department — open <strong>24 / 7</strong> at 123 Medical Center Drive.</p>
          </div>
          <a href="tel:911" className="emergency-call-btn">Call 911</a>
        </div>
      </aside>

    </main>
  );
}

export default ContactPage;
