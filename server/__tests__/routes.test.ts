import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { registerRoutes } from '../routes'

// Mock dependencies
vi.mock('../storage', () => ({
  storage: {
    getJobs: vi.fn(),
    getJobById: vi.fn(),
    acceptJob: vi.fn(),
    startJob: vi.fn(),
    completeJob: vi.fn(),
    getUser: vi.fn(),
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

vi.mock('../supabaseAuth', () => ({
  setupAuth: vi.fn(),
  isAuthenticated: vi.fn((req: any, res: any, next: any) => {
    req.user = { claims: { sub: 'test-user-id' } }
    next()
  })
}))

describe('API Routes', () => {
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

  describe('GET /api/jobs/available', () => {
    it('should return available jobs', async () => {
      const mockJobs = [
        { id: '1', title: 'Clean house', status: 'available' },
        { id: '2', title: 'Office cleaning', status: 'available' }
      ]

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobs).mockResolvedValue(mockJobs)

      const response = await request(app)
        .get('/api/jobs/available')
        .expect(200)

      expect(response.body).toEqual(mockJobs)
      expect(storage.getJobs).toHaveBeenCalledWith()
    })

    it('should handle errors', async () => {
      const { storage } = await import('../storage')
      vi.mocked(storage.getJobs).mockRejectedValue(new Error('Database error'))

      await request(app)
        .get('/api/jobs/available')
        .expect(500)
        .expect({ message: 'Failed to fetch available jobs' })
    })
  })

  describe('GET /api/jobs/:id', () => {
    it('should return a specific job', async () => {
      const mockJob = { id: '1', title: 'Clean house', status: 'available' }

      const { storage } = await import('../storage')
      vi.mocked(storage.getJobById).mockResolvedValue(mockJob)

      const response = await request(app)
        .get('/api/jobs/1')
        .expect(200)

      expect(response.body).toEqual(mockJob)
      expect(storage.getJobById).toHaveBeenCalledWith('1')
    })

    it('should return 404 for non-existent job', async () => {
      const { storage } = await import('../storage')
      vi.mocked(storage.getJobById).mockResolvedValue(null)

      await request(app)
        .get('/api/jobs/999')
        .expect(404)
        .expect({ message: 'Job not found' })
    })
  })

  describe('POST /api/jobs/:id/accept', () => {
    it('should accept a job', async () => {
      const mockJob = { id: '1', title: 'Clean house', status: 'accepted', providerId: 'test-user-id' }

      const { storage } = await import('../storage')
      vi.mocked(storage.acceptJob).mockResolvedValue(mockJob)

      const response = await request(app)
        .post('/api/jobs/1/accept')
        .expect(200)

      expect(response.body).toEqual(mockJob)
      expect(storage.acceptJob).toHaveBeenCalledWith('1', 'test-user-id')
    })
  })

  describe('GET /api/user/profile', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 'test-user-id', name: 'Test User', email: 'test@example.com' }

      const { storage } = await import('../storage')
      vi.mocked(storage.getUser).mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/user/profile')
        .expect(200)

      expect(response.body).toEqual(mockUser)
      expect(storage.getUser).toHaveBeenCalledWith('test-user-id')
    })
  })
})