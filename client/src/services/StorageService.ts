import { 
  Job, 
  JobStatus, 
  EarningsData, 
  PayoutRequest, 
  WorkingHours,
  TimeBlock,
  ProviderProfile,
  DEFAULT_CLEANING_CHECKLIST 
} from '../../../shared/schema';

// Storage keys
const JOBS_KEY = 'taskmaster_jobs';
const EARNINGS_KEY = 'taskmaster_earnings';
const PAYOUTS_KEY = 'taskmaster_payouts';
const PROFILE_KEY = 'taskmaster_profile';
const WORKING_HOURS_KEY = 'taskmaster_working_hours';
const TIME_BLOCKS_KEY = 'taskmaster_time_blocks';

export interface StorageService {
  // Job management
  saveJob(job: Job): Promise<void>;
  getJobsByStatus(status: JobStatus): Promise<Job[]>;
  getAllJobs(): Promise<Job[]>;
  getJobById(id: string): Promise<Job | null>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job>;
  deleteJob(id: string): Promise<void>;
  
  // Job workflows
  scheduleJob(jobId: string, date: Date): Promise<Job>;
  startJob(jobId: string): Promise<Job>;
  completeJob(jobId: string, documentation: Job['documentation']): Promise<Job>;
  
  // Financial operations
  getEarningsData(): Promise<EarningsData>;
  createPayoutRequest(amount: number, type: 'weekly' | 'instant'): Promise<PayoutRequest>;
  getPayoutHistory(): Promise<PayoutRequest[]>;
  
  // Schedule management
  getWorkingHours(): Promise<WorkingHours[]>;
  saveWorkingHours(hours: WorkingHours[]): Promise<void>;
  getTimeBlocks(): Promise<TimeBlock[]>;
  saveTimeBlock(block: TimeBlock): Promise<void>;
  deleteTimeBlock(id: string): Promise<void>;
  
  // Provider profile
  getProfile(): Promise<ProviderProfile>;
  updateProfile(updates: Partial<ProviderProfile>): Promise<ProviderProfile>;
}

class LocalStorageService implements StorageService {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parseJson<T>(data: string | null, defaultValue: T): T {
    if (!data) return defaultValue;
    try {
      return JSON.parse(data, (key, value) => {
        // Parse Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch {
      return defaultValue;
    }
  }

  // Job management methods
  async saveJob(job: Job): Promise<void> {
    await this.delay(50); // Simulate network delay
    
    const jobs = await this.getAllJobs();
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    
    job.updatedAt = new Date();
    
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
    } else {
      jobs.push(job);
    }
    
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  async getJobsByStatus(status: JobStatus): Promise<Job[]> {
    await this.delay(30);
    const allJobs = await this.getAllJobs();
    return allJobs.filter(job => job.status === status);
  }

  async getAllJobs(): Promise<Job[]> {
    const data = localStorage.getItem(JOBS_KEY);
    return this.parseJson(data, []);
  }

  async getJobById(id: string): Promise<Job | null> {
    await this.delay(30);
    const jobs = await this.getAllJobs();
    return jobs.find(job => job.id === id) || null;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    await this.delay(50);
    const job = await this.getJobById(id);
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    
    const updatedJob = { ...job, ...updates, updatedAt: new Date() };
    await this.saveJob(updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<void> {
    await this.delay(50);
    const jobs = await this.getAllJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
  }

  // Job workflow methods
  async scheduleJob(jobId: string, date: Date): Promise<Job> {
    return this.updateJob(jobId, {
      status: 'scheduled',
      scheduledDate: date,
      responseDeadline: undefined // Clear deadline when scheduled
    });
  }

  async startJob(jobId: string): Promise<Job> {
    const job = await this.getJobById(jobId);
    if (!job) {
      throw new Error(`Job with id ${jobId} not found`);
    }

    // Initialize documentation with default checklist
    const checklistItems = DEFAULT_CLEANING_CHECKLIST.map((item, index: number) => ({
      id: `${jobId}-checklist-${index}`,
      room: item.room,
      task: item.task,
      completed: false,
      notes: item.notes
    }));

    return this.updateJob(jobId, {
      status: 'scheduled', // Keep as scheduled, but mark as in-progress
      startedAt: new Date(), // Track when work actually began
      inProgress: true, // Flag to show this is actively being worked on
      documentation: {
        photos: [],
        checklistItems,
        completedAt: new Date(0), // Will be set properly when completed
        totalTimeSpent: 0
      }
    });
  }

  async completeJob(jobId: string, documentation: Job['documentation']): Promise<Job> {
    if (!documentation) {
      throw new Error('Documentation is required to complete a job');
    }

    return this.updateJob(jobId, {
      status: 'completed',
      documentation: {
        ...documentation,
        completedAt: new Date()
      }
    });
  }

  // Financial methods
  async getEarningsData(): Promise<EarningsData> {
    await this.delay(30);
    const jobs = await this.getJobsByStatus('completed');
    
    const totalEarnings = jobs.reduce((sum, job) => sum + job.rate, 0);
    const completedJobs = jobs.length;
    const avgJobValue = completedJobs > 0 ? totalEarnings / completedJobs : 0;
    
    // Mock weekly earnings (last 7 days)
    const weeklyEarnings = [45, 78, 92, 156, 134, 167, 89];
    const weeklyTotal = weeklyEarnings.reduce((sum, day) => sum + day, 0);
    
    // Calculate available balance (80% of total, simulating platform fees)
    const availableBalance = Math.round(totalEarnings * 0.8);
    const pendingBalance = totalEarnings - availableBalance;

    return {
      totalEarnings,
      availableBalance,
      pendingBalance,
      weeklyEarnings,
      completedJobs,
      avgJobValue: Math.round(avgJobValue)
    };
  }

  async createPayoutRequest(amount: number, type: 'weekly' | 'instant'): Promise<PayoutRequest> {
    await this.delay(100);
    
    const fee = type === 'instant' ? Math.round(amount * 0.015) : 0; // 1.5% for instant
    const netAmount = amount - fee;
    
    const payout: PayoutRequest = {
      id: `payout_${Date.now()}`,
      amount,
      fee,
      netAmount,
      type,
      status: 'pending',
      requestedAt: new Date()
    };

    const payouts = await this.getPayoutHistory();
    payouts.unshift(payout);
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(payouts));
    
    return payout;
  }

  async getPayoutHistory(): Promise<PayoutRequest[]> {
    const data = localStorage.getItem(PAYOUTS_KEY);
    return this.parseJson(data, []);
  }

  // Schedule management methods
  async getWorkingHours(): Promise<WorkingHours[]> {
    const data = localStorage.getItem(WORKING_HOURS_KEY);
    return this.parseJson(data, [
      { day: 'monday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'friday', enabled: true, startTime: '09:00', endTime: '17:00' },
      { day: 'saturday', enabled: false, startTime: '10:00', endTime: '16:00' },
      { day: 'sunday', enabled: false, startTime: '10:00', endTime: '16:00' }
    ]);
  }

  async saveWorkingHours(hours: WorkingHours[]): Promise<void> {
    await this.delay(50);
    localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(hours));
  }

  async getTimeBlocks(): Promise<TimeBlock[]> {
    const data = localStorage.getItem(TIME_BLOCKS_KEY);
    return this.parseJson(data, []);
  }

  async saveTimeBlock(block: TimeBlock): Promise<void> {
    await this.delay(50);
    const blocks = await this.getTimeBlocks();
    const existingIndex = blocks.findIndex(b => b.id === block.id);
    
    if (existingIndex >= 0) {
      blocks[existingIndex] = block;
    } else {
      blocks.push(block);
    }
    
    localStorage.setItem(TIME_BLOCKS_KEY, JSON.stringify(blocks));
  }

  async deleteTimeBlock(id: string): Promise<void> {
    await this.delay(50);
    const blocks = await this.getTimeBlocks();
    const filteredBlocks = blocks.filter(block => block.id !== id);
    localStorage.setItem(TIME_BLOCKS_KEY, JSON.stringify(filteredBlocks));
  }

  // Provider profile methods
  async getProfile(): Promise<ProviderProfile> {
    const data = localStorage.getItem(PROFILE_KEY);
    return this.parseJson(data, {
      id: 'provider_1',
      name: 'Service Provider',
      email: 'provider@taskmaster.com',
      phone: '(555) 123-4567',
      totalJobsCompleted: 247,
      joinedDate: new Date('2023-01-15'),
      serviceCapabilities: [
        { id: 'deep_clean', name: 'Deep Clean Expert', level: 'expert', verified: true },
        { id: 'move_clean', name: 'Move-in/out Cleaning', level: 'advanced', verified: true },
        { id: 'maintenance', name: 'Maintenance Clean', level: 'advanced', verified: false }
      ],
      workingHours: [],
      serviceArea: {
        radius: 15,
        centerAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        }
      }
    });
  }

  async updateProfile(updates: Partial<ProviderProfile>): Promise<ProviderProfile> {
    await this.delay(50);
    const profile = await this.getProfile();
    const updatedProfile = { ...profile, ...updates };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
  }
}

// Export singleton instance
export const storageService = new LocalStorageService();