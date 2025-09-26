
import { useEffect } from 'react';
import { useJobWorkflow } from '../../contexts/JobWorkflowContext';
import { useTimer } from '../../hooks/useTimer';
import { useToast } from '../../hooks/use-toast';

const TravelScreen = () => {
  const { setCurrentScreen, startJobTimer, travelStartTime, startTravelTimer } = useJobWorkflow();
  const travelTime = useTimer(travelStartTime);
  const { toast } = useToast();

  useEffect(() => {
    if (!travelStartTime) {
      startTravelTimer();
    }
  }, [travelStartTime, startTravelTimer]);

  const handleArrive = () => {
    startJobTimer();
    setCurrentScreen('checklist');
  };

  const handleOpenGPS = () => {
    toast({ title: 'Opening GPS navigation...' });
  };

  const handleCallCustomer = () => {
    toast({ title: 'Calling Jennifer Rodriguez...' });
  };

  return (
    <div id="travel-screen" className="screen active">
      <div className="status-card">
        <div className="status-icon">🚗</div>
        <div className="status-title">En Route</div>
        <div className="status-detail">Customer has been notified</div>
        <div className="timer-display" id="travelTimer">{travelTime}</div>
      </div>

      <div className="travel-info">
        <div className="travel-stat">
          <div className="travel-number">3.1 mi</div>
          <div className="travel-label">Distance</div>
        </div>
        <div className="travel-stat">
          <div className="travel-number">12 min</div>
          <div className="travel-label">ETA</div>
        </div>
      </div>

      <button className="workflow-btn success-btn" onClick={handleArrive}>Arrived / Clock In</button>
      <button className="workflow-btn secondary-btn" onClick={handleOpenGPS}>Open GPS</button>
      <button className="workflow-btn secondary-btn" onClick={handleCallCustomer}>Call Customer</button>
    </div>
  );
};

export default TravelScreen;
