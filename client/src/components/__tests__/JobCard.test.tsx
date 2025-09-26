import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import React from 'react'
import JobCard from '../JobCard'
import { JobProvider } from '@/contexts/JobContext'
import { JobWorkflowProvider } from '@/contexts/JobWorkflowContext'
import type { Job } from '@/utils/seedData'

// Mock the contexts
const mockAcceptJob = vi.fn()
const mockSetJobId = vi.fn()
const mockSetIsWorkflowActive = vi.fn()

vi.mock('@/contexts/JobContext', async () => {
  const actual = await vi.importActual('@/contexts/JobContext')
  return {
    ...actual,
    useJobs: () => ({
      acceptJob: mockAcceptJob,
      state: { loading: false },
    }),
  }
})

vi.mock('@/contexts/JobWorkflowContext', async () => {
  const actual = await vi.importActual('@/contexts/JobWorkflowContext')
  return {
    ...actual,
    useJobWorkflow: () => ({
      setJobId: mockSetJobId,
      setIsWorkflowActive: mockSetIsWorkflowActive,
    }),
    JobWorkflowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  // Create a mock JobProvider
  const MockJobProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

  return (
    <MockJobProvider>
      <JobWorkflowProvider>
        {children}
      </JobWorkflowProvider>
    </MockJobProvider>
  )
}

const mockAvailableJob: Job = {
  id: '1',
  serviceType: 'Deep Clean',
  customer: {
    name: 'John Doe',
    location: '123 Main St',
  },
  price: 150,
  tip: 25,
  access: 'Key under mat',
  status: 'available',
  dateTime: '2024-01-15 10:00 AM',
  isUrgent: true,
  distance: '2.5 mi',
}

const mockScheduledJob: Job = {
  id: '2',
  serviceType: 'Standard Clean',
  customer: {
    name: 'Jane Smith',
    location: '456 Oak Ave',
  },
  price: 100,
  status: 'scheduled',
  dateTime: '2024-01-16 2:00 PM',
}

const mockCompletedJob: Job = {
  id: '3',
  serviceType: 'Move-out Clean',
  customer: {
    name: 'Bob Johnson',
    location: '789 Pine St',
  },
  price: 200,
  status: 'completed',
  duration: '3h 15m',
  earnings: 225,
}

describe('JobCard', () => {
  const mockOnViewDetails = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Available Job Card', () => {
    it('renders available job correctly', () => {
      render(
        <TestWrapper>
          <JobCard job={mockAvailableJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByText('Deep Clean')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText('2024-01-15 10:00 AM')).toBeInTheDocument()
      expect(screen.getByText('Key under mat')).toBeInTheDocument()
      expect(screen.getByText('Est. $150 + $25 tip')).toBeInTheDocument()
      expect(screen.getByText('Urgent')).toBeInTheDocument()
    })

    it('handles accept job click', async () => {
      render(
        <TestWrapper>
          <JobCard job={mockAvailableJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      const acceptButton = screen.getByRole('button', { name: 'Accept' })
      fireEvent.click(acceptButton)

      await waitFor(() => {
        expect(mockAcceptJob).toHaveBeenCalledWith('1')
      })
    })

    it('handles view details click', () => {
      render(
        <TestWrapper>
          <JobCard job={mockAvailableJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      const viewDetailsButton = screen.getByRole('button', { name: 'View Details' })
      fireEvent.click(viewDetailsButton)

      expect(mockOnViewDetails).toHaveBeenCalledWith('1')
    })

    it('shows distance when not urgent', () => {
      const nonUrgentJob = { ...mockAvailableJob, isUrgent: false }
      render(
        <TestWrapper>
          <JobCard job={nonUrgentJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByText('2.5 mi')).toBeInTheDocument()
      expect(screen.queryByText('Urgent')).not.toBeInTheDocument()
    })
  })

  describe('Scheduled Job Card', () => {
    it('renders scheduled job correctly', () => {
      render(
        <TestWrapper>
          <JobCard job={mockScheduledJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByText('Standard Clean')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('SCHEDULED')).toBeInTheDocument()
      expect(screen.getByText('2024-01-16 2:00 PM')).toBeInTheDocument()
    })

    it('handles start job click', () => {
      render(
        <TestWrapper>
          <JobCard job={mockScheduledJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      const startJobButton = screen.getByRole('button', { name: 'Start Job' })
      fireEvent.click(startJobButton)

      expect(mockSetJobId).toHaveBeenCalledWith('2')
      expect(mockSetIsWorkflowActive).toHaveBeenCalledWith(true)
    })

    it('has contact button', () => {
      render(
        <TestWrapper>
          <JobCard job={mockScheduledJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument()
    })
  })

  describe('Completed Job Card', () => {
    it('renders completed job correctly', () => {
      render(
        <TestWrapper>
          <JobCard job={mockCompletedJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByText('Move-out Clean')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      expect(screen.getByText('3h 15m')).toBeInTheDocument()
      expect(screen.getByText('+$225')).toBeInTheDocument()
    })

    it('has view work button', () => {
      render(
        <TestWrapper>
          <JobCard job={mockCompletedJob} onViewDetails={mockOnViewDetails} />
        </TestWrapper>
      )

      expect(screen.getByRole('button', { name: 'View Work' })).toBeInTheDocument()
    })
  })

  it('returns null for invalid status', () => {
    const invalidJob = { ...mockAvailableJob, status: 'invalid' as any }
    const { container } = render(
      <TestWrapper>
        <JobCard job={invalidJob} onViewDetails={mockOnViewDetails} />
      </TestWrapper>
    )

    // The mock providers wrap the content, so check if JobCard itself is null
    // by looking for any job-related content that should not be present
    expect(screen.queryByText('Deep Clean')).not.toBeInTheDocument()
    expect(screen.queryByText('Accept')).not.toBeInTheDocument()
    expect(screen.queryByText('Start Job')).not.toBeInTheDocument()
  })
})