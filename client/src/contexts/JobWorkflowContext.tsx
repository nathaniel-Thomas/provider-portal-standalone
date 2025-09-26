
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  notApplicable: boolean;
  section: string;
}

type JobWorkflowState = {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  jobId: string | null;
  setJobId: (jobId: string | null) => void;
  isWorkflowActive: boolean;
  setIsWorkflowActive: (isActive: boolean) => void;
  travelStartTime: Date | null;
  jobStartTime: Date | null;
  startTravelTimer: () => void;
  startJobTimer: () => void;
  tasks: Task[];
  toggleTask: (taskId: number) => void;
  toggleTaskNA: (taskId: number) => void;
};

const JobWorkflowContext = createContext<JobWorkflowState | undefined>(undefined);

const initialTasks: Task[] = [
  { id: 1, name: 'Clean countertops and backsplash', completed: false, notApplicable: false, section: 'Kitchen' },
  { id: 2, name: 'Clean sink and faucet', completed: false, notApplicable: false, section: 'Kitchen' },
  { id: 3, name: 'Wipe down appliances (exterior)', completed: false, notApplicable: false, section: 'Kitchen' },
  { id: 4, name: 'Clean stovetop and range hood', completed: false, notApplicable: false, section: 'Kitchen' },
  { id: 5, name: 'Sweep and mop floor', completed: false, notApplicable: false, section: 'Kitchen' },
  { id: 6, name: 'Clean toilet inside and out', completed: false, notApplicable: false, section: 'Master Bathroom' },
  { id: 7, name: 'Clean shower/tub and tiles', completed: false, notApplicable: false, section: 'Master Bathroom' },
  { id: 8, name: 'Clean mirror and sink', completed: false, notApplicable: false, section: 'Master Bathroom' },
  { id: 9, name: 'Mop floor and replace towels', completed: false, notApplicable: false, section: 'Master Bathroom' },
  { id: 10, name: 'Dust furniture and surfaces', completed: false, notApplicable: false, section: 'Living Areas' },
  { id: 11, name: 'Vacuum carpets/clean hardwood', completed: false, notApplicable: false, section: 'Living Areas' },
  { id: 12, name: 'Empty trash and organize', completed: false, notApplicable: false, section: 'Living Areas' },
];

export const JobWorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState('jobDetails');
  const [jobId, setJobId] = useState<string | null>(null);
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [travelStartTime, setTravelStartTime] = useState<Date | null>(null);
  const [jobStartTime, setJobStartTime] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Reset state when workflow becomes inactive
  const setIsWorkflowActiveWithReset = (isActive: boolean) => {
    setIsWorkflowActive(isActive);
    if (!isActive) {
      setCurrentScreen('jobDetails');
      setTravelStartTime(null);
      setJobStartTime(null);
      setTasks(initialTasks);
      setJobId(null);
    }
  };

  const startTravelTimer = () => {
    setTravelStartTime(new Date());
  };

  const startJobTimer = () => {
    setJobStartTime(new Date());
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed, notApplicable: false } : task
    ));
  };

  const toggleTaskNA = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, notApplicable: !task.notApplicable, completed: false } : task
    ));
  };

  return (
    <JobWorkflowContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      jobId,
      setJobId,
      isWorkflowActive,
      setIsWorkflowActive: setIsWorkflowActiveWithReset,
      travelStartTime,
      jobStartTime,
      startTravelTimer,
      startJobTimer,
      tasks,
      toggleTask,
      toggleTaskNA
    }}>
      {children}
    </JobWorkflowContext.Provider>
  );
};

export const useJobWorkflow = () => {
  const context = useContext(JobWorkflowContext);
  if (!context) {
    throw new Error('useJobWorkflow must be used within a JobWorkflowProvider');
  }
  return context;
};
