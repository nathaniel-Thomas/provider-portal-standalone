// Backend routes - referencing javascript_log_in_with_replit and javascript_stripe integrations
import dotenv from "dotenv";
dotenv.config();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./supabaseAuth";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY - payment functionality will be disabled');
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy_key_for_local_development';
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Additional user data route (auth routes are handled in setupAuth)
  app.get('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Job Management Routes
  app.get('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobs = await storage.getJobs(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/available', async (req, res) => {
    try {
      const jobs = await storage.getJobs(); // No provider ID = available jobs
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching available jobs:", error);
      res.status(500).json({ message: "Failed to fetch available jobs" });
    }
  });

  app.get('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs/:id/accept', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const job = await storage.acceptJob(req.params.id, userId);
      res.json(job);
    } catch (error) {
      console.error("Error accepting job:", error);
      res.status(500).json({ message: "Failed to accept job" });
    }
  });

  app.post('/api/jobs/:id/start', isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.startJob(req.params.id);
      res.json(job);
    } catch (error) {
      console.error("Error starting job:", error);
      res.status(500).json({ message: "Failed to start job" });
    }
  });

  app.post('/api/jobs/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.completeJob(req.params.id);
      res.json(job);
    } catch (error) {
      console.error("Error completing job:", error);
      res.status(500).json({ message: "Failed to complete job" });
    }
  });

  // Documentation Routes
  app.get('/api/jobs/:id/photos', isAuthenticated, async (req: any, res) => {
    try {
      const photos = await storage.getJobPhotos(req.params.id);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.post('/api/jobs/:id/photos', isAuthenticated, async (req: any, res) => {
    try {
      const photo = await storage.addJobPhoto(req.params.id, req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error adding photo:", error);
      res.status(500).json({ message: "Failed to add photo" });
    }
  });

  app.delete('/api/photos/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.removeJobPhoto(req.params.id);
      res.json({ message: "Photo removed successfully" });
    } catch (error) {
      console.error("Error removing photo:", error);
      res.status(500).json({ message: "Failed to remove photo" });
    }
  });

  app.get('/api/jobs/:id/checklist', isAuthenticated, async (req: any, res) => {
    try {
      const checklist = await storage.getJobChecklist(req.params.id);
      res.json(checklist);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      res.status(500).json({ message: "Failed to fetch checklist" });
    }
  });

  app.put('/api/checklist/:id', isAuthenticated, async (req: any, res) => {
    try {
      const item = await storage.updateChecklistItem(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      console.error("Error updating checklist item:", error);
      res.status(500).json({ message: "Failed to update checklist item" });
    }
  });

  // Financial Routes
  app.get('/api/earnings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const earnings = await storage.getEarningsData(userId);
      res.json(earnings);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  app.post('/api/payout', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, type } = req.body;
      const payout = await storage.createPayoutRequest(userId, amount, type);
      res.json(payout);
    } catch (error) {
      console.error("Error creating payout:", error);
      res.status(500).json({ message: "Failed to create payout" });
    }
  });

  app.get('/api/payouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payouts = await storage.getUserPayoutRequests(userId);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ message: "Failed to fetch payouts" });
    }
  });

  // Communication Routes
  app.get('/api/jobs/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const messages = await storage.getJobMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/jobs/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content, messageType } = req.body;
      const message = await storage.sendMessage(req.params.id, userId, content, messageType);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Support Routes
  app.post('/api/support/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category, subject, description } = req.body;
      const ticket = await storage.createSupportTicket(userId, category, subject, description);
      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  app.get('/api/support/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
