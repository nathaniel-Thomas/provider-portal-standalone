
import { useState } from 'react';
import { useJobWorkflow } from '../../contexts/JobWorkflowContext';
import { useToast } from '../../hooks/use-toast';

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const CompletionScreen = () => {
  const { setCurrentScreen, travelStartTime, jobStartTime, tasks, setIsWorkflowActive } = useJobWorkflow();
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const { toast } = useToast();

  const jobEndTime = new Date();
  const travelTime = jobStartTime && travelStartTime ? jobStartTime.getTime() - travelStartTime.getTime() : 0;
  const workTime = jobStartTime ? jobEndTime.getTime() - jobStartTime.getTime() : 0;
  const totalTime = travelTime + workTime;

  const completedTasks = tasks.filter(task => task.completed || task.notApplicable).length;
  const totalTasks = tasks.length;

  const handleSignature = () => {
    setSignatureCaptured(true);
  };

  const handlePhotoCapture = () => {
    toast({ title: 'Photo captured successfully!' });
  };

  const handleFinishJob = () => {
    toast({ title: 'Job submitted successfully! Payment processing...' });

    setTimeout(() => {
      toast({ title: 'Payment received: $95.00' });
    }, 2000);

    setTimeout(() => {
      setIsWorkflowActive(false);
    }, 4000);
  };

  return (
    <div id="completion-screen" className="screen active">
      <div className="completion-card">
        <div className="completion-icon">✅</div>
        <div className="completion-title">Job Complete!</div>
        <div className="status-detail">Great work on this cleaning</div>
      </div>

      <div className="job-summary">
        <div className="summary-row">
          <span className="summary-label">Total time:</span>
          <span className="summary-value" id="totalTime">{formatTime(totalTime)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Travel time:</span>
          <span className="summary-value" id="travelTimeTotal">{formatTime(travelTime)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Work time:</span>
          <span className="summary-value" id="workTimeTotal">{formatTime(workTime)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Tasks completed:</span>
          <span className="summary-value" id="tasksCompleted">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Payment:</span>
          <span className="summary-value">$95.00</span>
        </div>
      </div>

      <div className="job-details">
        <div className="detail-title">Customer Signature</div>
      </div>
      
      <div className="signature-area" onClick={handleSignature}>
        {signatureCaptured ? (
          <div style={{color: '#10b981', fontWeight: 600}}>
            ✓ Signature captured<br />
            <small style={{color: '#6ee7b7'}}>Jennifer Rodriguez - {new Date().toLocaleTimeString()}</small>
          </div>
        ) : (
          <div className="signature-placeholder">
            Tap to capture customer signature<br />
            <small>(Required for job completion)</small>
          </div>
        )}
      </div>

      <div className="job-details">
        <div className="detail-title">Final Photos</div>
      </div>

      <div className="photo-grid">
        <div className="photo-slot" onClick={handlePhotoCapture}>
          <div className="photo-icon">📷</div>
          <div className="photo-label">Kitchen<br />After</div>
        </div>
        <div className="photo-slot" onClick={handlePhotoCapture}>
          <div className="photo-icon">📷</div>
          <div className="photo-label">Bathroom<br />After</div>
        </div>
        <div className="photo-slot" onClick={handlePhotoCapture}>
          <div className="photo-icon">📷</div>
          <div className="photo-label">Living Room<br />After</div>
        </div>
        <div className="photo-slot" onClick={handlePhotoCapture}>
          <div className="photo-icon">📷</div>
          <div className="photo-label">Overall<br />View</div>
        </div>
      </div>

      <button className="workflow-btn success-btn" onClick={handleFinishJob}>Submit & Request Payment</button>
    </div>
  );
};

export default CompletionScreen;
