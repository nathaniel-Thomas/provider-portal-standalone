
import { useJobWorkflow } from '../../contexts/JobWorkflowContext';
import { useToast } from '../../hooks/use-toast';

const JobDetailsScreen = () => {
  const { setCurrentScreen, startTravelTimer } = useJobWorkflow();
  const { toast } = useToast();

  const handleStartTravel = () => {
    startTravelTimer();
    setCurrentScreen('travel');
    setTimeout(() => {
      toast({ title: 'Customer notified: "Your cleaner is on the way!"' });
    }, 1000);
  };

  const handleContactCustomer = () => {
    toast({ title: 'Calling Jennifer Rodriguez...' });
  };

  return (
    <div id="job-details" className="screen active">
      <div className="job-card">
        <div className="job-header">
          <div className="service-tag">Standard Clean</div>
        </div>

        <div className="price">$95</div>

        <div className="customer-info">
          <div className="customer-name">Jennifer Rodriguez</div>
          <div className="customer-detail">📍 789 Elm Drive, Uptown, CA 94108</div>
          <div className="customer-detail">📞 (555) 123-4567</div>
          <div className="customer-detail">🕐 Scheduled: Sep 25, 2025 at 5:57 PM</div>
        </div>

        <div className="job-details">
          <div className="detail-title">Special Instructions</div>
          <div className="detail-text">Please use pet-safe cleaning products. Dog will be in backyard during service. Key is under the welcome mat.</div>
        </div>

        <div className="job-details">
          <div className="detail-title">Property Details</div>
          <div className="detail-text">3 bedrooms, 2 bathrooms, 1,800 sq ft. Focus on kitchen and master bathroom. Living room has hardwood floors.</div>
        </div>
      </div>

      <button className="workflow-btn primary-btn" onClick={handleStartTravel}>On My Way</button>
      <button className="workflow-btn secondary-btn" onClick={handleContactCustomer}>Contact Customer</button>
    </div>
  );
};

export default JobDetailsScreen;
