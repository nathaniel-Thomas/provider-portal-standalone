import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { registerRoutes } from '../routes'

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      paymentIntents: {
        create: vi.fn().mockResolvedValue({
          client_secret: 'pi_test_client_secret'
        })
      }
    }))
  }
})

// Mock storage
vi.mock('../storage', () => ({
  storage: {
    getUser: vi.fn(),
    getJobs: vi.fn(),
    getJobById: vi.fn(),
    acceptJob: vi.fn(),
    startJob: vi.fn(),
    completeJob: vi.fn(),
    getEarningsData: vi.fn(),
    createPayoutRequest: vi.fn(),
    getUserPayoutRequests: vi.fn(),
    getJobPhotos: vi.fn(),
    addJobPhoto: vi.fn(),
    removeJobPhoto: vi.fn(),
    getJobChecklist: vi.fn(),
    updateChecklistItem: vi.fn(),
    getJobMessages: vi.fn(),
    sendMessage: vi.fn(),
    createSupportTicket: vi.fn(),
    getUserSupportTickets: vi.fn()
  }
}))

// Mock auth
vi.mock('../supabaseAuth', () => ({
  setupAuth: vi.fn(),
  isAuthenticated: vi.fn((req: any, res: any, next: any) => {
    req.user = { claims: { sub: 'test-user-id' } }
    next()
  })
}))

describe('API Routes - Extended Coverage', () => {
  let app: express.Application
  let server: any

  beforeEach(async () => {
    app = express()
    app.use(express.json())
    server = await registerRoutes(app)
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (server) {
      server.close()
    }
  })

  describe('Job Management', () => {
    it('should get user-specific jobs', async () => {
      const mockJobs = [
        { id: '1', title: 'Clean house', providerId: 'test-user-id', status: 'scheduled' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobs).mockResolvedValue(mockJobs)

      const response = await request(app)
        .get('/api/jobs')
        .expect(200)

      expect(response.body).toEqual(mockJobs)
      expect(storage.getJobs).toHaveBeenCalledWith('test-user-id')
    })

    it('should start a job', async () => {
      const mockJob = { id: '1', status: 'in_progress', startedAt: new Date().toISOString() }

      const { storage } = await import('../storage')
      vi.mocked(storage.startJob).mockResolvedValue(mockJob)

      const response = await request(app)
        .post('/api/jobs/1/start')
        .expect(200)

      expect(response.body).toEqual(mockJob)
      expect(storage.startJob).toHaveBeenCalledWith('1')
    })

    it('should complete a job', async () => {
      const mockJob = { id: '1', status: 'completed', completedAt: new Date().toISOString() }

      const { storage } = await import('../storage')
      vi.mocked(storage.completeJob).mockResolvedValue(mockJob)

      const response = await request(app)
        .post('/api/jobs/1/complete')
        .expect(200)

      expect(response.body).toEqual(mockJob)
      expect(storage.completeJob).toHaveBeenCalledWith('1')
    })
  })

  describe('Documentation Routes', () => {
    it('should get job photos', async () => {
      const mockPhotos = [
        { id: '1', jobId: '1', url: 'photo1.jpg', caption: 'Before' },
        { id: '2', jobId: '1', url: 'photo2.jpg', caption: 'After' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobPhotos).mockResolvedValue(mockPhotos)

      const response = await request(app)
        .get('/api/jobs/1/photos')
        .expect(200)

      expect(response.body).toEqual(mockPhotos)
      expect(storage.getJobPhotos).toHaveBeenCalledWith('1')
    })

    it('should add job photo', async () => {
      const photoData = { url: 'new-photo.jpg', caption: 'Work completed' }
      const mockPhoto = { id: '3', jobId: '1', ...photoData }

      const { storage } = await import('../storage')
      vi.mocked(storage.addJobPhoto).mockResolvedValue(mockPhoto)

      const response = await request(app)
        .post('/api/jobs/1/photos')
        .send(photoData)
        .expect(200)

      expect(response.body).toEqual(mockPhoto)
      expect(storage.addJobPhoto).toHaveBeenCalledWith('1', photoData)
    })

    it('should remove job photo', async () => {
      const { storage } = await import('../storage')
      vi.mocked(storage.removeJobPhoto).mockResolvedValue(undefined)

      await request(app)
        .delete('/api/photos/1')
        .expect(200)
        .expect({ message: 'Photo removed successfully' })

      expect(storage.removeJobPhoto).toHaveBeenCalledWith('1')
    })

    it('should get job checklist', async () => {
      const mockChecklist = [
        { id: '1', task: 'Clean bathroom', completed: false },
        { id: '2', task: 'Vacuum carpet', completed: true }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobChecklist).mockResolvedValue(mockChecklist)

      const response = await request(app)
        .get('/api/jobs/1/checklist')
        .expect(200)

      expect(response.body).toEqual(mockChecklist)
      expect(storage.getJobChecklist).toHaveBeenCalledWith('1')
    })

    it('should update checklist item', async () => {
      const updateData = { completed: true }
      const mockItem = { id: '1', task: 'Clean bathroom', completed: true }

      const { storage } = await import('../storage')
      vi.mocked(storage.updateChecklistItem).mockResolvedValue(mockItem)

      const response = await request(app)
        .put('/api/checklist/1')
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual(mockItem)
      expect(storage.updateChecklistItem).toHaveBeenCalledWith('1', updateData)
    })
  })

  describe('Financial Routes', () => {
    it('should get earnings data', async () => {
      const mockEarnings = {
        totalEarnings: 1250.50,
        thisWeek: 350.00,
        thisMonth: 1200.00,
        pendingPayouts: 250.00
      }

      const { storage } = await import('../storage')
      vi.mocked(storage.getEarningsData).mockResolvedValue(mockEarnings)

      const response = await request(app)
        .get('/api/earnings')
        .expect(200)

      expect(response.body).toEqual(mockEarnings)
      expect(storage.getEarningsData).toHaveBeenCalledWith('test-user-id')
    })

    it('should create payout request', async () => {
      const payoutData = { amount: 500, type: 'instant' }
      const mockPayout = { id: 'payout_123', ...payoutData, status: 'pending' }

      const { storage } = await import('../storage')
      vi.mocked(storage.createPayoutRequest).mockResolvedValue(mockPayout)

      const response = await request(app)
        .post('/api/payout')
        .send(payoutData)
        .expect(200)

      expect(response.body).toEqual(mockPayout)
      expect(storage.createPayoutRequest).toHaveBeenCalledWith('test-user-id', 500, 'instant')
    })

    it('should get user payouts', async () => {
      const mockPayouts = [
        { id: 'payout_123', amount: 500, status: 'completed', createdAt: '2024-01-15' },
        { id: 'payout_124', amount: 300, status: 'pending', createdAt: '2024-01-16' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getUserPayoutRequests).mockResolvedValue(mockPayouts)

      const response = await request(app)
        .get('/api/payouts')
        .expect(200)

      expect(response.body).toEqual(mockPayouts)
      expect(storage.getUserPayoutRequests).toHaveBeenCalledWith('test-user-id')
    })
  })

  describe('Communication Routes', () => {
    it('should get job messages', async () => {
      const mockMessages = [
        { id: '1', jobId: '1', from: 'customer', content: 'When will you arrive?', timestamp: '2024-01-15T10:00:00Z' },
        { id: '2', jobId: '1', from: 'provider', content: 'I will be there in 30 minutes', timestamp: '2024-01-15T10:05:00Z' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobMessages).mockResolvedValue(mockMessages)

      const response = await request(app)
        .get('/api/jobs/1/messages')
        .expect(200)

      expect(response.body).toEqual(mockMessages)
      expect(storage.getJobMessages).toHaveBeenCalledWith('1')
    })

    it('should send job message', async () => {
      const messageData = { content: 'I have arrived', messageType: 'update' }
      const mockMessage = { id: '3', jobId: '1', from: 'test-user-id', ...messageData, timestamp: '2024-01-15T10:30:00Z' }

      const { storage } = await import('../storage')
      vi.mocked(storage.sendMessage).mockResolvedValue(mockMessage)

      const response = await request(app)
        .post('/api/jobs/1/messages')
        .send(messageData)
        .expect(200)

      expect(response.body).toEqual(mockMessage)
      expect(storage.sendMessage).toHaveBeenCalledWith('1', 'test-user-id', 'I have arrived', 'update')
    })
  })

  describe('Support Routes', () => {
    it('should create support ticket', async () => {
      const ticketData = { category: 'payment', subject: 'Payment not received', description: 'I completed a job but payment is missing' }
      const mockTicket = { id: 'ticket_123', userId: 'test-user-id', ...ticketData, status: 'open', createdAt: '2024-01-15T10:00:00Z' }

      const { storage } = await import('../storage')
      vi.mocked(storage.createSupportTicket).mockResolvedValue(mockTicket)

      const response = await request(app)
        .post('/api/support/tickets')
        .send(ticketData)
        .expect(200)

      expect(response.body).toEqual(mockTicket)
      expect(storage.createSupportTicket).toHaveBeenCalledWith('test-user-id', 'payment', 'Payment not received', 'I completed a job but payment is missing')
    })

    it('should get user support tickets', async () => {
      const mockTickets = [
        { id: 'ticket_123', subject: 'Payment not received', status: 'open', createdAt: '2024-01-15' },
        { id: 'ticket_124', subject: 'App not working', status: 'resolved', createdAt: '2024-01-14' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getUserSupportTickets).mockResolvedValue(mockTickets)

      const response = await request(app)
        .get('/api/support/tickets')
        .expect(200)

      expect(response.body).toEqual(mockTickets)
      expect(storage.getUserSupportTickets).toHaveBeenCalledWith('test-user-id')
    })
  })

  describe('Stripe Payment Routes', () => {
    it('should create payment intent', async () => {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe('test-key')
      vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
        client_secret: 'pi_test_client_secret'
      } as any)

      const response = await request(app)
        .post('/api/create-payment-intent')
        .send({ amount: 100.50 })
        .expect(200)

      expect(response.body.clientSecret).toBe('pi_test_client_secret')
    })

    it('should handle Stripe errors', async () => {
      // Mock Stripe to throw an error
      const stripeMock = {
        paymentIntents: {
          create: vi.fn().mockRejectedValue(new Error('Invalid amount'))
        }
      }

      // Need to properly mock the Stripe constructor for this test
      vi.doMock('stripe', () => ({
        default: vi.fn().mockImplementation(() => stripeMock)
      }))

      await request(app)
        .post('/api/create-payment-intent')
        .send({ amount: 100 })
        .expect(500)
        .expect((res) => {
          expect(res.body.message).toContain('Error creating payment intent')
        })
    })
  })

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      const { storage } = await import('../storage')
      vi.mocked(storage.getJobs).mockRejectedValue(new Error('Database connection failed'))

      await request(app)
        .get('/api/jobs')
        .expect(500)
        .expect({ message: 'Failed to fetch jobs' })
    })

    it('should handle missing job errors', async () => {
      const { storage } = await import('../storage')
      vi.mocked(storage.getJobById).mockResolvedValue(null)

      await request(app)
        .get('/api/jobs/nonexistent')
        .expect(404)
        .expect({ message: 'Job not found' })
    })

    it('should handle invalid request data', async () => {
      // Test with malformed JSON
      await request(app)
        .post('/api/jobs/1/messages')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400)
    })
  })
})