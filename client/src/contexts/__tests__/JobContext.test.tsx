import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { JobProvider, useJobs, JobStatus } from '../JobContext'
import React, { ReactNode } from 'react'

// Mock the seed data
vi.mock('@/utils/seedData', () => ({
  availableJobs: [
    { id: '1', status: 'available', serviceType: 'Deep Clean' },
    { id: '2', status: 'available', serviceType: 'Standard Clean' },
  ],
  scheduledJobs: [
    { id: '3', status: 'scheduled', serviceType: 'Move-out Clean' },
  ],
  completedJobs: [
    { id: '4', status: 'completed', serviceType: 'Office Clean' },
  ],
}))

// Test component to access context
const TestComponent = ({ onData }: { onData: (data: any) => void }) => {
  const context = useJobs()

  React.useEffect(() => {
    onData(context)
  }, [context, onData])

  return (
    <div>
      <div data-testid="loading">{context.state.loading.toString()}</div>
      <div data-testid="job-count">{context.state.jobs.length}</div>
      <div data-testid="active-filter">{context.state.activeFilter}</div>
      <div data-testid="filtered-count">{context.getFilteredJobs().length}</div>
    </div>
  )
}

describe('JobContext', () => {
  let contextData: any

  const renderWithProvider = (children: ReactNode) => {
    return render(
      <JobProvider>
        {children}
      </JobProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    contextData = null
  })

  it('should provide initial state', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(contextData.state.jobs).toHaveLength(4)
    expect(contextData.state.activeFilter).toBe('available')
    expect(contextData.getFilteredJobs()).toHaveLength(2)
  })

  it('should load jobs on mount', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('job-count')).toHaveTextContent('0')

    // After loading completes
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('job-count')).toHaveTextContent('4')
  })

  it('should accept a job', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      await contextData.acceptJob('1')
    })

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Check that job status was updated
    const updatedJob = contextData.getJobById('1')
    expect(updatedJob?.status).toBe('scheduled')
  })

  it('should filter jobs correctly', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Initially shows available jobs
    expect(screen.getByTestId('filtered-count')).toHaveTextContent('2')

    // Switch to scheduled
    act(() => {
      contextData.setActiveFilter('scheduled' as JobStatus)
    })

    expect(screen.getByTestId('active-filter')).toHaveTextContent('scheduled')
    expect(screen.getByTestId('filtered-count')).toHaveTextContent('1')

    // Switch to completed
    act(() => {
      contextData.setActiveFilter('completed' as JobStatus)
    })

    expect(screen.getByTestId('filtered-count')).toHaveTextContent('1')
  })

  it('should find job by id', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    const job = contextData.getJobById('1')
    expect(job).toBeDefined()
    expect(job?.id).toBe('1')
    expect(job?.serviceType).toBe('Deep Clean')

    const nonExistentJob = contextData.getJobById('999')
    expect(nonExistentJob).toBeUndefined()
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent onData={() => {}} />)
    }).toThrow('useJobs must be used within a JobProvider')

    consoleSpy.mockRestore()
  })

  it('should handle loading state during job acceptance', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Start accepting job
    await act(async () => {
      const acceptPromise = contextData.acceptJob('1')

      // Check loading state immediately after starting
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true')
      }, { timeout: 100 })

      // Wait for completion
      await acceptPromise
    })

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })

  it('should update job correctly', async () => {
    renderWithProvider(
      <TestComponent onData={(data) => { contextData = data }} />
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    const originalJob = contextData.getJobById('1')
    expect(originalJob?.status).toBe('available')

    await act(async () => {
      await contextData.acceptJob('1')
    })

    await waitFor(() => {
      const updatedJob = contextData.getJobById('1')
      expect(updatedJob?.status).toBe('scheduled')
      expect(updatedJob?.serviceType).toBe('Deep Clean') // Other properties should remain unchanged
    })
  })
})