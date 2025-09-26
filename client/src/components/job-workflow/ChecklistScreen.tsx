
import { useJobWorkflow, Task } from '../../contexts/JobWorkflowContext';
import { useTimer } from '../../hooks/useTimer';
import { useToast } from '../../hooks/use-toast';

const ChecklistScreen = () => {
  const { jobStartTime, tasks, toggleTask, toggleTaskNA } = useJobWorkflow();
  const jobTime = useTimer(jobStartTime);
  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.completed || task.notApplicable).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handlePhotoClick = () => {
    toast({ title: "Photo captured successfully!" });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Auto-save notes functionality
    const textarea = e.target;
    clearTimeout((textarea as any).saveTimeout);
    (textarea as any).saveTimeout = setTimeout(() => {
      console.log('Notes saved:', textarea.value);
      toast({ title: "Notes saved", duration: 1000 });
    }, 2000);
  };

  const renderSection = (sectionName: string) => {
    const sectionTasks = tasks.filter(task => task.section === sectionName);
    const completedSectionTasks = sectionTasks.filter(task => task.completed || task.notApplicable).length;

    return (
      <div className="checklist-section">
        <div className="section-header">
          <div className="section-title">{sectionName}</div>
          <div className="section-progress">{completedSectionTasks}/{sectionTasks.length} completed</div>
        </div>
        
        {sectionTasks.map(task => (
          <div className="task-item" key={task.id}>
            <div className={`task-checkbox ${task.completed ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
              {task.completed ? '✓' : ''}
            </div>
            <div className="task-content">
              <div className={`task-name ${task.completed ? 'completed' : ''} ${task.notApplicable ? 'not-applicable' : ''}`}>{task.name}</div>
              <div className="task-options">
                <button className="task-btn photo-btn" onClick={handlePhotoClick}>📷 Photo</button>
                <button className={`task-btn na-btn ${task.notApplicable ? 'active' : ''}`} onClick={() => toggleTaskNA(task.id)}>
                  {task.notApplicable ? 'N/A ✓' : 'N/A'}
                </button>
              </div>
            </div>
          </div>
        ))}

        <textarea
          className="notes-area"
          placeholder={`Notes for ${sectionName.toLowerCase()}...`}
          onChange={handleNotesChange}
        ></textarea>
      </div>
    );
  }

  return (
    <div id="checklist-screen" className="screen active">
      <div className="progress-bar">
        <div className="progress-fill" id="progressFill" style={{width: `${progress}%`}}></div>
      </div>

      <div className="status-card" style={{background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
        <div className="status-title" style={{color: '#34d399'}}>Job In Progress</div>
        <div className="timer-display" id="jobTimer">{jobTime}</div>
      </div>

      {renderSection('Kitchen')}
      {renderSection('Master Bathroom')}
      {renderSection('Living Areas')}

      <div style={{height: '120px'}}></div>
    </div>
  );
};

export default ChecklistScreen;
