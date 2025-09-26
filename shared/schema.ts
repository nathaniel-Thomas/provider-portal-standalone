// Database schema using Drizzle ORM - PostgreSQL compatible
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// Enums for job management
export const jobStatusEnum = pgEnum('job_status', ['scheduled', 'available', 'completed']);
export const serviceTypeEnum = pgEnum('service_type', ['Deep Clean', 'Standard Clean', 'Move-in Clean', 'Move-out Clean', 'Post-Construction', 'Maintenance']);
export const priorityEnum = pgEnum('priority', ['normal', 'asap', 'urgent']);
export const payoutTypeEnum = pgEnum('payout_type', ['weekly', 'instant']);
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'completed', 'failed']);
export const photoTypeEnum = pgEnum('photo_type', ['before', 'after']);
export const timeBlockTypeEnum = pgEnum('time_block_type', ['unavailable', 'personal', 'maintenance']);
export const serviceLevelEnum = pgEnum('service_level', ['basic', 'advanced', 'expert']);
export const dayOfWeekEnum = pgEnum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

// Session storage table - mandatory for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth, extended for service providers
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  totalJobsCompleted: integer("total_jobs_completed").default(0),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Jobs table
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").references(() => users.id),
  status: jobStatusEnum("status").notNull(),
  serviceType: serviceTypeEnum("service_type").notNull(),
  priority: priorityEnum("priority").notNull(),
  location: jsonb("location").notNull(),
  distance: varchar("distance").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  startedAt: timestamp("started_at"),
  estimatedDuration: integer("estimated_duration").notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  estimatedTip: varchar("estimated_tip"),
  customerName: varchar("customer_name"),
  customerPhone: varchar("customer_phone"),
  accessInstructions: text("access_instructions"),
  specialInstructions: text("special_instructions"),
  responseDeadline: timestamp("response_deadline"),
  competitorCount: integer("competitor_count"),
  inProgress: boolean("in_progress").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photos table for service documentation
export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  url: text("url").notNull(),
  room: varchar("room").notNull(),
  type: photoTypeEnum("type").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Checklist items for service documentation
export const checklistItems = pgTable("checklist_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  room: varchar("room").notNull(),
  task: text("task").notNull(),
  completed: boolean("completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job documentation table
export const jobDocumentation = pgTable("job_documentation", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  completedAt: timestamp("completed_at").notNull(),
  totalTimeSpent: integer("total_time_spent"),
  providerNotes: text("provider_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payout requests table
export const payoutRequests = pgTable("payout_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
  type: payoutTypeEnum("type").notNull(),
  status: payoutStatusEnum("status").notNull(),
  paymentMethod: varchar("payment_method"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Messages table for communication
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type").default('text'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support tickets table
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category").notNull(),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default('open'),
  priority: varchar("priority").default('normal'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for the converted schema
export type JobStatus = 'scheduled' | 'available' | 'completed';
export type ServiceType = 'Deep Clean' | 'Standard Clean' | 'Move-in Clean' | 'Move-out Clean' | 'Post-Construction' | 'Maintenance';
export type Priority = 'normal' | 'asap' | 'urgent';

// Type definitions that match the database schema
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Photo {
  id: string;
  url: string;
  room: string;
  type: 'before' | 'after';
  timestamp: Date;
  caption?: string;
}

export interface ChecklistItem {
  id: string;
  room: string;
  task: string;
  completed: boolean;
  notes?: string;
}

export interface Documentation {
  photos: Photo[];
  checklistItems: ChecklistItem[];
  completedAt: Date;
  startedAt?: Date;
  totalTimeSpent?: number;
  providerNotes?: string;
  startLocation?: any;
  endLocation?: any;
  customerSignature?: string;
  customerName?: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  serviceType: ServiceType;
  priority: Priority;
  location: Address;
  distance: string;
  scheduledDate?: Date;
  startedAt?: Date;
  estimatedDuration: number;
  rate: number;
  estimatedTip?: string;
  customerName?: string;
  customerPhone?: string;
  accessInstructions?: string;
  specialInstructions?: string;
  responseDeadline?: Date;
  competitorCount?: number;
  inProgress?: boolean;
  documentation?: Documentation;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  type: 'weekly' | 'instant';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  processedAt?: Date;
  paymentMethod?: string;
}

export interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  weeklyEarnings: number[];
  completedJobs: number;
  avgJobValue: number;
}

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'unavailable' | 'personal' | 'maintenance';
  notes?: string;
}

export interface ServiceCapability {
  id: string;
  name: string;
  level: 'basic' | 'advanced' | 'expert';
  verified: boolean;
}

export interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  totalJobsCompleted: number;
  joinedDate: Date;
  serviceCapabilities: ServiceCapability[];
  workingHours: WorkingHours[];
  serviceArea: {
    radius: number;
    centerAddress: Address;
  };
}

// Default room-based checklist templates
export const DEFAULT_CLEANING_CHECKLIST: Omit<ChecklistItem, 'id' | 'completed'>[] = [
  // Kitchen
  { room: 'Kitchen', task: 'Clean and sanitize countertops', notes: 'Use appropriate cleaner for surface type' },
  { room: 'Kitchen', task: 'Clean inside and outside of microwave', notes: '' },
  { room: 'Kitchen', task: 'Clean stovetop and oven exterior', notes: '' },
  { room: 'Kitchen', task: 'Clean and sanitize sink and faucet', notes: '' },
  { room: 'Kitchen', task: 'Wipe down cabinet fronts', notes: '' },
  { room: 'Kitchen', task: 'Sweep and mop floor', notes: '' },
  
  // Living Areas
  { room: 'Living Room', task: 'Dust all surfaces and furniture', notes: '' },
  { room: 'Living Room', task: 'Vacuum or sweep floors', notes: '' },
  { room: 'Living Room', task: 'Clean windows and mirrors', notes: '' },
  { room: 'Living Room', task: 'Empty trash and replace liner', notes: '' },
  
  // Bathrooms
  { room: 'Bathroom', task: 'Clean and disinfect toilet inside and out', notes: '' },
  { room: 'Bathroom', task: 'Clean shower/tub with appropriate products', notes: '' },
  { room: 'Bathroom', task: 'Clean and sanitize sink and vanity', notes: '' },
  { room: 'Bathroom', task: 'Clean mirrors and fixtures', notes: '' },
  { room: 'Bathroom', task: 'Sweep and mop floor', notes: '' },
  { room: 'Bathroom', task: 'Restock supplies (toilet paper, towels)', notes: '' },
  
  // Bedrooms
  { room: 'Bedroom', task: 'Make beds and organize pillows', notes: '' },
  { room: 'Bedroom', task: 'Dust surfaces and nightstands', notes: '' },
  { room: 'Bedroom', task: 'Vacuum or sweep floors', notes: '' },
  { room: 'Bedroom', task: 'Empty trash if present', notes: '' }
];

// Database table type exports
export type JobRecord = typeof jobs.$inferSelect;
export type PhotoRecord = typeof photos.$inferSelect;
export type ChecklistItemRecord = typeof checklistItems.$inferSelect;
export type PayoutRequestRecord = typeof payoutRequests.$inferSelect;
export type MessageRecord = typeof messages.$inferSelect;
export type SupportTicketRecord = typeof supportTickets.$inferSelect;