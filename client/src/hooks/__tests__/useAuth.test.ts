import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '../useAuth'
import React, { ReactNode } from 'react'

// Mock the fetch function
global.fetch = vi.fn()

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return loading state initially', () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: '1', name: 'Test User' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.user).toBeUndefined()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should return user data when authenticated', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockUser), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle authentication failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', {
        status: 401,
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toBeUndefined()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle network errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toBeUndefined()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should use correct query key', () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(fetch).toHaveBeenCalledWith('/api/auth/user', expect.any(Object))
  })
})