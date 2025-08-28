import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchUsers, fetchUserById } from '../apiService'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock console.error to suppress expected error logs in tests
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('apiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    consoleSpy.mockClear()
  })

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      })

      const result = await fetchUsers()

      expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
      expect(result).toEqual(mockUsers)
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchUsers()).rejects.toThrow('HTTP error! status: 500')
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching users:', expect.any(Error))
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      await expect(fetchUsers()).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching users:', networkError)
    })
  })

  describe('fetchUserById', () => {
    it('should fetch user by id successfully', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      })

      const result = await fetchUserById(1)

      expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1')
      expect(result).toEqual(mockUser)
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should throw error when user not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(fetchUserById(999)).rejects.toThrow('HTTP error! status: 404')
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user:', expect.any(Error))
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      await expect(fetchUserById(1)).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user:', networkError)
    })
  })
})