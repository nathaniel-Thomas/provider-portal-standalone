
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { availableJobs, scheduledJobs, completedJobs } from '../utils/seedData';

export type JobStatus = 'available' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Documentation {
  photos: string[];
  notes: string;
}

export interface Job {
  id: string;
  serviceType: string;
  customer: {
    name: string;
    location: string;
  };
  price: number;
  tip?: number;
  access?: string;
  timeEstimate?: string;
  status: JobStatus;
  dateTime?: string;
  isUrgent?: boolean;
  distance?: string;
  duration?: string;
  earnings?: number;
  documentation?: Documentation;
}

interface State {
  jobs: Job[];
  loading: boolean;
  activeFilter: JobStatus;
}

type Action =
  | { type: 'SET_JOBS'; jobs: Job[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'UPDATE_JOB'; id: string; updates: Partial<Job> }
  | { type: 'SET_ACTIVE_FILTER'; filter: JobStatus };

const initialState: State = {
  jobs: [],
  loading: false,
  activeFilter: 'available',
};

const jobReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_JOBS':
      return { ...state, jobs: action.jobs, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.id ? { ...job, ...action.updates } : job
        ),
      };
    case 'SET_ACTIVE_FILTER':
      return { ...state, activeFilter: action.filter };
    default:
      return state;
  }
};

interface JobContextValue {
  state: State;
  loadJobs: () => Promise<void>;
  acceptJob: (id: string) => Promise<void>;
  scheduleJob: (id: string, date: Date) => Promise<void>;
  startJob: (id: string) => Promise<void>;
  completeJob: (id: string, documentation: Documentation) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  setActiveFilter: (filter: JobStatus) => void;
  getFilteredJobs: () => Job[];
  getJobById: (id: string) => Job | undefined;
}

const JobContext = createContext<JobContextValue | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    const allJobs = [...availableJobs, ...scheduledJobs, ...completedJobs];
    setTimeout(() => {
      dispatch({ type: 'SET_JOBS', jobs: allJobs });
    }, 500);
  };

  const acceptJob = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    setTimeout(() => {
      dispatch({ type: 'UPDATE_JOB', id, updates: { status: 'scheduled' } });
      dispatch({ type: 'SET_LOADING', loading: false });
      console.log('Job accepted locally:', id);
    }, 500);
  };

  const scheduleJob = async (id: string, date: Date): Promise<void> => { console.log('scheduleJob', id, date) };
  const startJob = async (id: string): Promise<void> => { console.log('startJob', id) };
  const completeJob = async (id: string, documentation: Documentation): Promise<void> => { console.log('completeJob', id, documentation) };
  const deleteJob = async (id: string): Promise<void> => { console.log('deleteJob', id) };

  const setActiveFilter = (filter: JobStatus): void => {
    dispatch({ type: 'SET_ACTIVE_FILTER', filter });
  };

  const getFilteredJobs = (): Job[] => {
    return state.jobs.filter(job => job.status === state.activeFilter);
  };

  const getJobById = (id: string): Job | undefined => {
    return state.jobs.find(job => job.id === id);
  };

  const value: JobContextValue = {
    state,
    loadJobs,
    acceptJob,
    scheduleJob,
    startJob,
    completeJob,
    deleteJob,
    setActiveFilter,
    getFilteredJobs,
    getJobById
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
