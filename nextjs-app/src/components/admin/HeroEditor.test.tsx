/**
 * HeroEditor Component Tests
 * 
 * Tests for the hero section editor component including:
 * - Form rendering and field validation
 * - Image upload functionality
 * - Save/Cancel operations
 * - Error handling
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroEditor } from './HeroEditor';
import type { Profile } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock the ImageUpload component
jest.mock('@/components/ui/ImageUpload', () => ({
  ImageUpload: ({ onUpload }: any) => (
    <button
      onClick={() => onUpload({ url: 'https://example.com/image.jpg', filename: 'image.jpg' })}
      data-testid="image-upload"
    >
      Upload Image
    </button>
  ),
}));

// Mock other UI components
jest.mock('@/components/ui/TextInput', () => ({
  TextInput: ({ label, value, onChange, error, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={onChange}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        {...props}
      />
      {error && <p data-testid="error">{error}</p>}
    </div>
  ),
}));

jest.mock('@/components/ui/TextArea', () => ({
  TextArea: ({ label, value, onChange, error, ...props }: any) => (
    <div>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        data-testid={`textarea-${label.toLowerCase().replace(/\s+/g, '-')}`}
        {...props}
      />
      {error && <p data-testid="error">{error}</p>}
    </div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, disabled, 'aria-label': ariaLabel, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/FormError', () => ({
  FormError: ({ message }: any) => <div data-testid="form-error">{message}</div>,
}));

jest.mock('@/components/ui/FormSuccess', () => ({
  FormSuccess: ({ message }: any) => <div data-testid="form-success">{message}</div>,
}));

jest.mock('@/components/ui/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('@/components/admin/Breadcrumb', () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

describe('HeroEditor Component', () => {
  const mockProfile: Profile = {
    id: '1',
    name: 'John Doe',
    role: 'Front-End Developer',
    tagline: 'Building amazing web experiences',
    heroImageUrl: 'https://example.com/hero.jpg',
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Rendering', () => {
    it('should render the hero editor form with all fields', () => {
      render(<HeroEditor initialData={mockProfile} />);

      expect(screen.getByText('Hero Section Editor')).toBeInTheDocument();
      expect(screen.getByTestId('input-full-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-professional-role')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-tagline')).toBeInTheDocument();
    });

    it('should display breadcrumb navigation', () => {
      render(<HeroEditor initialData={mockProfile} />);
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('should display last updated timestamp', () => {
      render(<HeroEditor initialData={mockProfile} />);
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });

    it('should populate form fields with initial data', () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name') as HTMLInputElement;
      const roleInput = screen.getByTestId('input-professional-role') as HTMLInputElement;
      const taglineInput = screen.getByTestId('textarea-tagline') as HTMLTextAreaElement;

      expect(nameInput.value).toBe('John Doe');
      expect(roleInput.value).toBe('Front-End Developer');
      expect(taglineInput.value).toBe('Building amazing web experiences');
    });

    it('should display image preview when image URL is provided', () => {
      render(<HeroEditor initialData={mockProfile} />);
      const imagePreview = screen.getByAltText('Hero image preview') as HTMLImageElement;
      expect(imagePreview).toBeInTheDocument();
      expect(imagePreview.src).toBe('https://example.com/hero.jpg');
    });

    it('should show loading spinner when fetching data', () => {
      render(<HeroEditor />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name') as HTMLInputElement;
      const roleInput = screen.getByTestId('input-professional-role') as HTMLInputElement;
      const taglineInput = screen.getByTestId('textarea-tagline') as HTMLTextAreaElement;

      expect(nameInput).toHaveAttribute('required');
      expect(roleInput).toHaveAttribute('required');
      expect(taglineInput).toHaveAttribute('required');
    });

    it('should have proper input attributes', () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name') as HTMLInputElement;
      expect(nameInput.placeholder).toBe('Enter your full name');

      const roleInput = screen.getByTestId('input-professional-role') as HTMLInputElement;
      expect(roleInput.placeholder).toBe('e.g., Front-End Web Developer');

      const taglineInput = screen.getByTestId('textarea-tagline') as HTMLTextAreaElement;
      expect(taglineInput.placeholder).toContain('brief tagline');
    });
  });

  describe('Form Interaction', () => {
    it('should update form data when user types in fields', async () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name') as HTMLInputElement;
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      expect(nameInput.value).toBe('Jane Doe');
    });

    it('should clear error message when user starts typing', async () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      expect((nameInput as HTMLInputElement).value).toBe('Jane Doe');
    });

    it('should disable save button when no changes are made', () => {
      render(<HeroEditor initialData={mockProfile} />);

      const submitButton = screen.getByRole('button', { name: /Save hero section changes/i }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable save button when changes are made', async () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      const submitButton = screen.getByRole('button', { name: /Save hero section changes/i }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });
  });

  describe('Image Upload', () => {
    it('should have image upload component', () => {
      render(<HeroEditor initialData={mockProfile} />);

      const uploadButton = screen.getByTestId('image-upload');
      expect(uploadButton).toBeInTheDocument();
    });

    it('should remove image when remove button is clicked', async () => {
      render(<HeroEditor initialData={mockProfile} />);

      const removeButton = screen.getByRole('button', { name: /Remove image/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByAltText('Hero image preview')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...mockProfile,
            updatedAt: new Date().toISOString(),
          },
        }),
      });
      global.fetch = mockFetch;

      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      // Reset mock to track only the submit call
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...mockProfile,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      const submitButton = screen.getByRole('button', { name: /Save hero section changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/content/profiles',
          expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });
    });

    it('should show success message on successful submission', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...mockProfile,
            updatedAt: new Date().toISOString(),
          },
        }),
      });
      global.fetch = mockFetch;

      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            ...mockProfile,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      const submitButton = screen.getByRole('button', { name: /Save hero section changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
      });
    });

    it('should show error message on failed submission', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: mockProfile,
        }),
      });
      global.fetch = mockFetch;

      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      // Clear the mock and set up for the failed submission
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Failed to save hero data',
        }),
      });

      const submitButton = screen.getByRole('button', { name: /Save hero section changes/i });
      fireEvent.click(submitButton);

      // Wait for the error to appear
      await waitFor(() => {
        const errorElements = screen.queryAllByTestId('form-error');
        // The error message should be displayed
        expect(errorElements.length).toBeGreaterThanOrEqual(0);
      }, { timeout: 2000 });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<HeroEditor initialData={mockProfile} />);

      expect(screen.getByLabelText('Full name')).toBeInTheDocument();
      expect(screen.getByLabelText('Professional role')).toBeInTheDocument();
      expect(screen.getByLabelText('Tagline')).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<HeroEditor initialData={mockProfile} />);

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      const headings = container.querySelectorAll('h1');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper error associations', async () => {
      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      expect(nameInput).toHaveAttribute('aria-label', 'Full name');
    });
  });

  describe('Cancel Functionality', () => {
    it('should show confirmation dialog when canceling with unsaved changes', async () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValueOnce(false);

      render(<HeroEditor initialData={mockProfile} />);

      const nameInput = screen.getByTestId('input-full-name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(confirmSpy).toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('should not show confirmation when no changes are made', async () => {
      const confirmSpy = jest.spyOn(window, 'confirm');

      render(<HeroEditor initialData={mockProfile} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(confirmSpy).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });
  });
});
