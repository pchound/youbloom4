import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    const mockOnSearchChange = vi.fn()
    render(
      <SearchBar 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
        placeholder="Test placeholder" 
      />
    )
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })

  it('calls onSearchChange when input value changes', () => {
    const mockOnSearchChange = vi.fn()
    render(
      <SearchBar 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
        placeholder="Search..." 
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'test query' } })
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('test query')
  })

  it('displays current search term', () => {
    const mockOnSearchChange = vi.fn()
    render(
      <SearchBar 
        searchTerm="current search" 
        onSearchChange={mockOnSearchChange} 
        placeholder="Search..." 
      />
    )
    
    const searchInput = screen.getByDisplayValue('current search')
    expect(searchInput).toBeInTheDocument()
  })
})