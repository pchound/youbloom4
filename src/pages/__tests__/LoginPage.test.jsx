import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper function to render components with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    window.sessionStorage.clear()
  })

  it('renders login form with phone input and submit button', () => {
    renderWithProviders(<LoginPage />)
    
    expect(screen.getByText('youbloom')).toBeInTheDocument()
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error for empty phone number', async () => {
    renderWithProviders(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Phone number is required')).toBeInTheDocument()
  })

  it('shows validation error for phone number not starting with +254', async () => {
    renderWithProviders(<LoginPage />)
    
    const phoneInput = screen.getByLabelText('Phone Number')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Phone number must start with +254')).toBeInTheDocument()
  })

  it('shows validation error for incorrect phone number length', async () => {
    renderWithProviders(<LoginPage />)
    
    const phoneInput = screen.getByLabelText('Phone Number')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(phoneInput, { target: { value: '+254123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Phone number must be 13 characters long (including +254)')).toBeInTheDocument()
  })

  it('shows error for invalid phone number', async () => {
    renderWithProviders(<LoginPage />)
    
    const phoneInput = screen.getByLabelText('Phone Number')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(phoneInput, { target: { value: '+254123456789' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid phone number. Use +254712345678')).toBeInTheDocument()
    })
  })

  it('successful login with valid phone number', async () => {
    renderWithProviders(<LoginPage />)
    
    const phoneInput = screen.getByLabelText('Phone Number')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(phoneInput, { target: { value: '+254712345678' } })
    fireEvent.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/main')
    }, { timeout: 1500 })
  })
})
