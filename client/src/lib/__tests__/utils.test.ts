import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('flex', 'items-center', 'justify-center')
      expect(result).toBe('flex items-center justify-center')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('button', isActive && 'active', 'text-white')
      expect(result).toBe('button active text-white')
    })

    it('should filter out falsy values', () => {
      const result = cn('button', false && 'hidden', null, undefined, 'visible')
      expect(result).toBe('button visible')
    })

    it('should handle array of classes', () => {
      const result = cn(['flex', 'items-center'], 'justify-center')
      expect(result).toBe('flex items-center justify-center')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should merge conflicting Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'p-4')
      // tailwind-merge should resolve conflicts, keeping the last one
      expect(result).toBe('p-4')
    })
  })
})