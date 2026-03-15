import { useState, useEffect } from 'react';
import { departments } from '../../../data/mockData';
import ServiceCard from '../ServiceCard/ServiceCard';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import FeatureFallback from '../../common/FeatureFallback/FeatureFallback';
import './ServicesList.css';

function ServicesList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Simulate fetching data with potential failure
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Simulate 98% success rate
        if (Math.random() > 0.02) {
          setServicesData(departments);
        } else {
          throw new Error('Failed to load services');
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Retry loading
    setTimeout(() => {
      setServicesData(departments);
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <FeatureFallback
        featureName="Medical Departments"
        message="We're having trouble loading our medical departments. Please try again."
        onRetry={handleRetry}
      >
        <p>In the meantime, you can contact us directly at (555) 123-4567 for information about our services.</p>
      </FeatureFallback>
    );
  }

  return (
    <section className="services-list" aria-labelledby="services-list-title">
      <div className="services-list-header">
        <h1 id="services-list-title">Our Medical Departments</h1>
        <p>Click on any department to view detailed information, operating hours, and our expert doctors.</p>
      </div>
      
      <div className="services-grid" role="list">
        {servicesData.map(department => (
          <ServiceCard key={department.id} department={department} />
        ))}
      </div>
    </section>
  );
}

export default ServicesList;
