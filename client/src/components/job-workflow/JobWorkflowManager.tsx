
import { useJobWorkflow } from '../../contexts/JobWorkflowContext';
import { useToast } from '../../hooks/use-toast';
import JobDetailsScreen from './JobDetailsScreen';
import TravelScreen from './TravelScreen';
import ChecklistScreen from './ChecklistScreen';
import CompletionScreen from './CompletionScreen';

const JobWorkflowManager = () => {
  const { currentScreen, setCurrentScreen, setIsWorkflowActive } = useJobWorkflow();
  const { toast } = useToast();

  const screenTitles: { [key: string]: string } = {
    jobDetails: 'Job Details',
    travel: 'En Route',
    checklist: 'Job In Progress',
    completion: 'Job Complete',
  };

  const goBack = () => {
    if (currentScreen === 'jobDetails') {
      setIsWorkflowActive(false);
    } else if (currentScreen === 'travel') {
      setCurrentScreen('jobDetails');
    } else if (currentScreen === 'checklist') {
      setCurrentScreen('travel');
    } else if (currentScreen === 'completion') {
      setCurrentScreen('checklist');
    }
  };

  const handleAddPhotos = () => {
    toast({ title: 'Photo captured successfully!' });
  };

  const renderScreen = () => {
    const screenComponent = (() => {
      switch (currentScreen) {
        case 'jobDetails':
          return <JobDetailsScreen />;
        case 'travel':
          return <TravelScreen />;
        case 'checklist':
          return <ChecklistScreen />;
        case 'completion':
          return <CompletionScreen />;
        default:
          return <JobDetailsScreen />;
      }
    })();

    return <div className="fade-in">{screenComponent}</div>;
  };

  return (
    <div className="app-container" style={{background: '#0f0f23', minHeight: '100vh'}}>
      <div className="header">
        <button className="back-btn" onClick={goBack}>←</button>
        <div className="header-title" id="screenTitle">{screenTitles[currentScreen]}</div>
      </div>

      {renderScreen()}

      {currentScreen === 'checklist' && (
        <div className="bottom-actions" id="checklistActions">
          <div className="action-row">
            <button className="action-btn secondary-btn" onClick={handleAddPhotos}>Add Photos</button>
            <button className="action-btn warning-btn" onClick={() => setCurrentScreen('completion')}>Clock Out</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobWorkflowManager;
