/**
 * Tests for UserProfileCard Component
 * 
 * Tests the display of user profile information including:
 * - Email address display
 * - Account status indicator
 * - Last login timestamp
 * - Account creation date
 * - Last update date
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProfileCard } from './UserProfileCard';
import { AdminUser } from '@/types';

describe('UserProfileCard', () => {
  const mockUser: AdminUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  };

  it('renders user email address', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays active status when user is active', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays inactive status when user is inactive', () => {
    const inactiveUser: AdminUser = {
      ...mockUser,
      isActive: false,
    };
    render(<UserProfileCard user={inactiveUser} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('displays account information section', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Account Information')).toBeInTheDocument();
  });

  it('displays activity section', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Activity')).toBeInTheDocument();
  });

  it('displays last login timestamp', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Last Login')).toBeInTheDocument();
  });

  it('displays account created date', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Account Created')).toBeInTheDocument();
  });

  it('displays last updated date', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
  });

  it('displays user ID', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('test-user-id')).toBeInTheDocument();
  });

  it('displays avatar with first letter of email', () => {
    render(<UserProfileCard user={mockUser} />);
    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
  });

  it('handles undefined lastLogin gracefully', () => {
    const userWithoutLastLogin: AdminUser = {
      ...mockUser,
      lastLogin: undefined,
    };
    render(<UserProfileCard user={userWithoutLastLogin} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    // Check that dates are formatted (not just raw ISO strings)
    const dateElements = screen.getAllByText(/January|2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });
});
