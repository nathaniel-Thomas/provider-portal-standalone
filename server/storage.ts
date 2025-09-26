// Storage implementation referencing javascript_log_in_with_replit integration
import {
  users,
  jobs,
  photos,
  checklistItems,
  jobDocumentation,
  payoutRequests,
  messages,
  supportTickets,
  type User,
  type UpsertUser,
  type JobRecord,
  DEFAULT_CLEANING_CHECKLIST,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Job operations
  getJobs(providerId?: string): Promise<JobRecord[]>;
  getJobById(id: string): Promise<JobRecord | undefined>;
  createJob(job: any): Promise<JobRecord>;
  updateJob(id: string, updates: Partial<JobRecord>): Promise<JobRecord>;
  acceptJob(jobId: string, providerId: string): Promise<JobRecord>;
  startJob(jobId: string): Promise<JobRecord>;
  completeJob(jobId: string): Promise<JobRecord>;
  
  // Documentation operations
  getJobPhotos(jobId: string): Promise<any[]>;
  addJobPhoto(jobId: string, photo: any): Promise<any>;
  removeJobPhoto(photoId: string): Promise<void>;
  getJobChecklist(jobId: string): Promise<any[]>;
  updateChecklistItem(itemId: string, updates: any): Promise<any>;
  createJobDocumentation(jobId: string): Promise<void>;
  
  // Financial operations
  createPayoutRequest(userId: string, amount: number, type: 'weekly' | 'instant'): Promise<any>;
  getUserPayoutRequests(userId: string): Promise<any[]>;
  getEarningsData(userId: string): Promise<any>;
  
  // Communication operations
  getJobMessages(jobId: string): Promise<any[]>;
  sendMessage(jobId: string, senderId: string, content: string, messageType?: string): Promise<any>;
  
  // Support operations
  createSupportTicket(userId: string, category: string, subject: string, description: string): Promise<any>;
  getUserSupportTickets(userId: string): Promise<any[]>;
  
  // Stripe operations for payments
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Job operations
  async getJobs(providerId?: string): Promise<JobRecord[]> {
    try {
      const query = db.select().from(jobs);
      if (providerId) {
        return await query.where(eq(jobs.providerId, providerId)).orderBy(desc(jobs.createdAt));
      }
      return await query.where(eq(jobs.status, 'available')).orderBy(desc(jobs.createdAt));
    } catch (error) {
      console.log('Database not available, using mock data for jobs');
      // Return mock data for development when database is not available
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const mockJobs: JobRecord[] = [
        {
          id: '1',
          status: 'scheduled',
          serviceType: 'Deep Clean',
          priority: 'normal',
          location: JSON.stringify({
            street: '1234 Oak Street',
            city: 'Downtown',
            state: 'CA',
            zip: '90210'
          }),
          distance: '2.3 mi',
          scheduledDate: today,
          startedAt: null,
          estimatedDuration: 3,
          rate: '120.00',
          estimatedTip: '20',
          customerName: 'Sarah Johnson',
          customerPhone: '+1-555-0123',
          customerRating: '4.8',
          accessInstructions: 'Key under the mat',
          specialInstructions: 'Please be careful with the antique furniture',
          responseDeadline: null,
          competitorCount: 2,
          inProgress: false,
          providerId: providerId || null,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01')
        },
        {
          id: '2',
          status: 'scheduled',
          serviceType: 'Standard Clean',
          priority: 'asap',
          location: JSON.stringify({
            street: '5678 Pine Avenue',
            city: 'Midtown',
            state: 'CA',
            zip: '90211'
          }),
          distance: '1.8 mi',
          scheduledDate: tomorrow,
          startedAt: null,
          estimatedDuration: 2,
          rate: '85.00',
          estimatedTip: '15',
          customerName: 'Emma Davis',
          customerPhone: '+1-555-0456',
          customerRating: '4.9',
          accessInstructions: 'Ring doorbell',
          specialInstructions: 'Pet-friendly products only, two cats in the house',
          responseDeadline: null,
          competitorCount: 1,
          inProgress: false,
          providerId: providerId || null,
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date('2025-01-02')
        },
        {
          id: '3',
          status: 'scheduled',
          serviceType: 'Move-out Clean',
          priority: 'urgent',
          location: JSON.stringify({
            street: '9012 Elm Drive',
            city: 'Uptown',
            state: 'CA',
            zip: '90212'
          }),
          distance: '3.1 mi',
          scheduledDate: dayAfterTomorrow,
          startedAt: null,
          estimatedDuration: 4,
          rate: '180.00',
          estimatedTip: '30',
          customerName: 'Michael Chen',
          customerPhone: '+1-555-0789',
          customerRating: '4.7',
          accessInstructions: 'Lockbox code: 1234',
          specialInstructions: 'Deep clean required for security deposit return',
          responseDeadline: null,
          competitorCount: 3,
          inProgress: false,
          providerId: providerId || null,
          createdAt: new Date('2025-01-03'),
          updatedAt: new Date('2025-01-03')
        },
        {
          id: '4',
          status: 'scheduled',
          serviceType: 'Post-Construction',
          priority: 'normal',
          location: JSON.stringify({
            street: '456 Maple Lane',
            city: 'Westside',
            state: 'CA',
            zip: '90213'
          }),
          distance: '4.2 mi',
          scheduledDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
          startedAt: null,
          estimatedDuration: 6,
          rate: '250.00',
          estimatedTip: '40',
          customerName: 'Lisa Rodriguez',
          customerPhone: '+1-555-0321',
          customerRating: '4.6',
          accessInstructions: 'Construction site entrance on the side',
          specialInstructions: 'Heavy-duty cleaning needed, lots of dust and debris',
          responseDeadline: null,
          competitorCount: 0,
          inProgress: false,
          providerId: providerId || null,
          createdAt: new Date('2025-01-04'),
          updatedAt: new Date('2025-01-04')
        },
        {
          id: '5',
          status: 'available',
          serviceType: 'Standard Clean',
          priority: 'normal',
          location: JSON.stringify({
            street: '789 Cedar Street',
            city: 'Eastside',
            state: 'CA',
            zip: '90214'
          }),
          distance: '2.7 mi',
          scheduledDate: null,
          startedAt: null,
          estimatedDuration: 2.5,
          rate: '95.00',
          estimatedTip: '18',
          customerName: 'Robert Kim',
          customerPhone: '+1-555-0654',
          customerRating: '4.5',
          accessInstructions: 'Garage door opener code: 5678',
          specialInstructions: 'Regular bi-weekly service',
          responseDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          competitorCount: 2,
          inProgress: false,
          providerId: null,
          createdAt: new Date('2025-01-05'),
          updatedAt: new Date('2025-01-05')
        }
      ];

      if (providerId) {
        return mockJobs.filter(job => job.providerId === providerId);
      } else {
        return mockJobs.filter(job => job.status === 'available');
      }
    }
  }

  async getJobById(id: string): Promise<JobRecord | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(jobData: any): Promise<JobRecord> {
    const [job] = await db.insert(jobs).values(jobData).returning();
    
    // Create default checklist for the job
    const checklistData = DEFAULT_CLEANING_CHECKLIST.map(item => ({
      jobId: job.id,
      room: item.room,
      task: item.task,
      notes: item.notes,
      completed: false,
    }));
    
    await db.insert(checklistItems).values(checklistData);
    
    return job;
  }

  async updateJob(id: string, updates: Partial<JobRecord>): Promise<JobRecord> {
    const [job] = await db
      .update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async acceptJob(jobId: string, providerId: string): Promise<JobRecord> {
    const [job] = await db
      .update(jobs)
      .set({
        status: 'scheduled',
        providerId,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();
    return job;
  }

  async startJob(jobId: string): Promise<JobRecord> {
    const [job] = await db
      .update(jobs)
      .set({
        inProgress: true,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();
    return job;
  }

  async completeJob(jobId: string): Promise<JobRecord> {
    const [job] = await db
      .update(jobs)
      .set({
        status: 'completed',
        inProgress: false,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    // Create job documentation entry
    await db.insert(jobDocumentation).values({
      jobId,
      completedAt: new Date(),
    });

    return job;
  }

  // Documentation operations
  async getJobPhotos(jobId: string): Promise<any[]> {
    return await db.select().from(photos).where(eq(photos.jobId, jobId)).orderBy(asc(photos.createdAt));
  }

  async addJobPhoto(jobId: string, photoData: any): Promise<any> {
    const [photo] = await db.insert(photos).values({
      jobId,
      ...photoData,
    }).returning();
    return photo;
  }

  async removeJobPhoto(photoId: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, photoId));
  }

  async getJobChecklist(jobId: string): Promise<any[]> {
    return await db.select().from(checklistItems).where(eq(checklistItems.jobId, jobId)).orderBy(asc(checklistItems.room));
  }

  async updateChecklistItem(itemId: string, updates: any): Promise<any> {
    const [item] = await db
      .update(checklistItems)
      .set(updates)
      .where(eq(checklistItems.id, itemId))
      .returning();
    return item;
  }

  async createJobDocumentation(jobId: string): Promise<void> {
    await db.insert(jobDocumentation).values({
      jobId,
      completedAt: new Date(),
    });
  }

  // Financial operations
  async createPayoutRequest(userId: string, amount: number, type: 'weekly' | 'instant'): Promise<any> {
    const fee = type === 'instant' ? amount * 0.015 : 0; // 1.5% fee for instant payouts
    const netAmount = amount - fee;

    const [payout] = await db.insert(payoutRequests).values({
      userId,
      amount: amount.toString(),
      fee: fee.toString(),
      netAmount: netAmount.toString(),
      type,
      status: 'pending',
    }).returning();

    return payout;
  }

  async getUserPayoutRequests(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(payoutRequests)
      .where(eq(payoutRequests.userId, userId))
      .orderBy(desc(payoutRequests.requestedAt));
  }

  async getEarningsData(userId: string): Promise<any> {
    // This would normally involve complex calculations
    // For now, return mock data structure that matches the interface
    const completedJobs = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.providerId, userId), eq(jobs.status, 'completed')));

    const totalEarnings = completedJobs.reduce((sum: number, job: any) => sum + parseFloat(job.rate), 0);
    
    return {
      totalEarnings,
      availableBalance: totalEarnings * 0.8, // 80% available
      pendingBalance: totalEarnings * 0.2, // 20% pending
      weeklyEarnings: [120, 340, 280, 450, 380, 290, 520], // Mock weekly data
      completedJobs: completedJobs.length,
      avgJobValue: completedJobs.length > 0 ? totalEarnings / completedJobs.length : 0,
    };
  }

  // Communication operations
  async getJobMessages(jobId: string): Promise<any[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.jobId, jobId))
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(jobId: string, senderId: string, content: string, messageType = 'text'): Promise<any> {
    const [message] = await db.insert(messages).values({
      jobId,
      senderId,
      content,
      messageType,
    }).returning();
    return message;
  }

  // Support operations
  async createSupportTicket(userId: string, category: string, subject: string, description: string): Promise<any> {
    const [ticket] = await db.insert(supportTickets).values({
      userId,
      category,
      subject,
      description,
    }).returning();
    return ticket;
  }

  async getUserSupportTickets(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  // Stripe operations
  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
