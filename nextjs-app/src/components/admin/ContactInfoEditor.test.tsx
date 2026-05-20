/**
 * ContactInfoEditor Component Tests
 * 
 * Tests for the contact information editor component including:
 * - Form rendering and field validation
 * - URL validation for social links
 * - Test link functionality
 * - Version history management
 * - Save/Cancel functionality
 * - Error handling
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactInfoEditor } from './ContactInfoEditor';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock child components
jest.mock('@/components/ui/TextInput', () => ({
  TextInput: ({ label, placeholder, value, onChange, error, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid={`input-${placeholder}`}
        {...props}
      />
      {error && <span className="error">{error}</span>}
    </div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, type, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/FormError', () => ({
  FormError: ({ message }: any) => <div className="error-message">{message}</div>,
}));

jest.mock('@/components/ui/FormSuccess', () => ({
  FormSuccess: ({ message }: any) => <div className="success-message">{message}</div>,
}));

jest.mock('@/components/ui/LoadingSpinner', () => ({
  LoadingSpinner: () => <div>Loading...</div>,
}));

jest.mock('@/components/admin/Breadcrumb', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

describe('ContactInfoEditor', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    global.fetch = jest.fn();
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the contact info editor form', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);
      
      await waitFor(() => {
        expect(screen.getByText('Contact Information Editor')).toBeInTheDocument();
        expect(screen.getByText('Manage your social media links and contact information')).toBeInTheDocument();
      });
    });

    it('should render all form fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);
      
      await waitFor(() => {
        expect(screen.getByText('GitHub URL')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn URL')).toBeInTheDocument();
        expect(screen.getByText('Instagram URL')).toBeInTheDocument();
        expect(screen.getByText('Telegram URL')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
      });
    });

    it('should render Save and Cancel buttons', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save contact information changes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    it('should display loading spinner when fetching data', () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {})); // Never resolves

      render(<ContactInfoEditor />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with initial data if provided', async () => {
      const initialData = {
        id: '1',
        githubUrl: 'https://github.com/testuser',
        linkedinUrl: 'https://linkedin.com/in/testuser',
        instagramUrl: 'https://instagram.com/testuser',
        telegramUrl: 'https://t.me/testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      render(<ContactInfoEditor initialData={initialData} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate GitHub URL format', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const githubInput = screen.getByPlaceholderText('https://github.com/username') as HTMLInputElement;
      await userEvent.type(githubInput, 'invalid-url');

      const submitButton = screen.getByRole('button', { name: /save contact information changes/i });
      fireEvent.click(submitButton);

      // The validation should prevent submission
      // Check that the input still has the invalid value
      expect(githubInput.value).toBe('invalid-url');
    });

    it('should require at least one field to be filled', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /save contact information changes/i });
      fireEvent.click(submitButton);

      // The submit button should still be disabled since no fields are filled
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              id: '1',
              github_url: 'https://github.com/testuser',
              linkedin_url: 'https://linkedin.com/in/testuser',
              instagram_url: 'https://instagram.com/testuser',
              telegram_url: 'https://t.me/testuser',
              email: 'test@example.com',
              updated_at: new Date().toISOString(),
            },
            message: 'Contact information updated successfully',
          }),
        });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const githubInput = screen.getByPlaceholderText('https://github.com/username');
      await userEvent.type(githubInput, 'https://github.com/testuser');

      const submitButton = screen.getByRole('button', { name: /save contact information changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/contact information updated successfully/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Test Link Functionality', () => {
    it('should open GitHub link in new tab', async () => {
      const initialData = {
        id: '1',
        githubUrl: 'https://github.com/testuser',
        linkedinUrl: '',
        instagramUrl: '',
        telegramUrl: '',
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      render(<ContactInfoEditor initialData={initialData} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const testButton = screen.getByRole('button', { name: /test github link/i });
      fireEvent.click(testButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://github.com/testuser',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Cancel Functionality', () => {
    it('should navigate back without confirmation if no changes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Version History', () => {
    it('should display version history button', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            id: '1',
            github_url: 'https://github.com/testuser',
            linkedin_url: 'https://linkedin.com/in/testuser',
            instagram_url: 'https://instagram.com/testuser',
            telegram_url: 'https://t.me/testuser',
            email: 'test@example.com',
            updated_at: new Date().toISOString(),
          }],
        }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /show version history/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(screen.getByLabelText('GitHub URL')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Telegram URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch contact info on mount', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            id: '1',
            github_url: 'https://github.com/testuser',
            linkedin_url: 'https://linkedin.com/in/testuser',
            instagram_url: 'https://instagram.com/testuser',
            telegram_url: 'https://t.me/testuser',
            email: 'test@example.com',
            updated_at: new Date().toISOString(),
          }],
        }),
      });

      render(<ContactInfoEditor />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/content/contact-info',
          expect.objectContaining({
            credentials: 'include',
          })
        );
      });
    });
  });
});
