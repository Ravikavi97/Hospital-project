import './AboutSection.css';

function AboutSection() {
  return (
    <div className="about-section">
      <div className="about-hero">
        <h1>About Green Valley Hospital</h1>
        <p className="about-tagline">Committed to Excellence in Healthcare Since 1985</p>
      </div>

      <div className="about-content">
        <section className="about-mission" aria-labelledby="mission-heading">
          <h2 id="mission-heading">Our Mission</h2>
          <p>
            At Green Valley Hospital, our mission is to provide compassionate, high-quality healthcare 
            services to our community. We are dedicated to improving the health and well-being of every 
            patient through innovative medical practices, advanced technology, and a patient-centered 
            approach to care.
          </p>
        </section>

        <section className="about-values" aria-labelledby="values-heading">
          <h2 id="values-heading">Our Values</h2>
          <div className="values-grid" role="list">
            <article className="value-card" role="listitem">
              <div className="value-icon" aria-hidden="true">🤝</div>
              <h3>Compassion</h3>
              <p>We treat every patient with empathy, respect, and dignity, understanding that healthcare is deeply personal.</p>
            </article>
            <article className="value-card" role="listitem">
              <div className="value-icon" aria-hidden="true">⭐</div>
              <h3>Excellence</h3>
              <p>We strive for the highest standards in medical care, continuously improving our services and expertise.</p>
            </article>
            <article className="value-card" role="listitem">
              <div className="value-icon" aria-hidden="true">🔬</div>
              <h3>Innovation</h3>
              <p>We embrace cutting-edge medical technology and evidence-based practices to deliver the best outcomes.</p>
            </article>
            <article className="value-card" role="listitem">
              <div className="value-icon" aria-hidden="true">🌟</div>
              <h3>Integrity</h3>
              <p>We maintain the highest ethical standards, ensuring transparency and trust in all our interactions.</p>
            </article>
          </div>
        </section>

        <section className="about-facility" aria-labelledby="facility-heading">
          <h2 id="facility-heading">Our Facility</h2>
          <div className="facility-info">
            <div className="facility-text">
              <p>
                Green Valley Hospital is a state-of-the-art medical facility spanning 200,000 square feet, 
                equipped with the latest medical technology and staffed by over 500 dedicated healthcare 
                professionals. Our facility includes:
              </p>
              <ul className="facility-features">
                <li>150 private patient rooms with modern amenities</li>
                <li>6 fully-equipped operating theaters</li>
                <li>24/7 Emergency Department</li>
                <li>Advanced diagnostic imaging center</li>
                <li>Comprehensive laboratory services</li>
                <li>Specialized intensive care units</li>
                <li>Outpatient clinics for various specialties</li>
                <li>On-site pharmacy and rehabilitation center</li>
              </ul>
            </div>
            <div className="facility-stats" role="list" aria-label="Hospital statistics">
              <div className="stat-item" role="listitem">
                <div className="stat-number" aria-label="Over 500 healthcare professionals">500+</div>
                <div className="stat-label">Healthcare Professionals</div>
              </div>
              <div className="stat-item" role="listitem">
                <div className="stat-number" aria-label="Over 50,000 patients served annually">50,000+</div>
                <div className="stat-label">Patients Served Annually</div>
              </div>
              <div className="stat-item" role="listitem">
                <div className="stat-number" aria-label="24 hours a day, 7 days a week emergency care">24/7</div>
                <div className="stat-label">Emergency Care</div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-commitment" aria-labelledby="commitment-heading">
          <h2 id="commitment-heading">Our Commitment to You</h2>
          <p>
            We understand that choosing a healthcare provider is one of the most important decisions you 
            can make. At Green Valley Hospital, we are committed to earning your trust through exceptional 
            care, clear communication, and a genuine concern for your well-being. Whether you're visiting 
            us for a routine check-up or a complex procedure, you can count on our team to provide the 
            highest level of medical expertise and personal attention.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutSection;
