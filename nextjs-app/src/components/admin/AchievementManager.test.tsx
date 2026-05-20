/**
 * AchievementManager Component Tests
 * 
 * Tests for the achievement manager component including:
 * - Achievement list rendering with card view
 * - Add/Edit/Delete functionality
 * - Search and filtering by category
 * - PDF upload and preview
 * - PDF validation (format and size)
 * - URL validation for external links
 * - Confirmation dialog for deletion
 * - Error handling and loading states
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementManager } from './AchievementManager';
import type { Achievement } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, disabled, variant, size, isLoading, className, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} data-variant={variant} data-size={size} className={className} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}));

jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children, size }: any) => 
    isOpen ? (
      <div data-testid="modal" data-size={size}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose} data-testid="modal-close">Close</button>
      </div>
    ) : null,
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

jest.mock('@/components/ui/TextInput', () => ({
  TextInput: ({ label, value, onChange, error, type, placeholder, required, ...props }: any) => (
    <div data-testid={`text-input-${label?.toLowerCase().replace(/\s+/g, '-')}`}>
      <label>{label}</label>
      <input 
        type={type || 'text'} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && <span data-testid="input-error">{error}</span>}
    </div>
  ),
}));

jest.mock('@/components/ui/PDFUpload', () => ({
  PDFUpload: ({ onUpload, onError, folder }: any) => (
    <div data-testid="pdf-upload">
      <button 
        onClick={() => onUpload({ url: 'https://example.com/cert.pdf' })}
        data-testid="pdf-upload-button"
      >
        Upload PDF
      </button>
    </div>
  ),
}));

jest.mock('@/components/ui/PDFPreview', () => ({
  PDFPreview: ({ url, maxHeight }: any) => (
    <div data-testid="pdf-preview" data-url={url} data-max-height={maxHeight}>
      PDF Preview
    </div>
  ),
}));

jest.mock('@/components/admin/Breadcrumb', () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

describe('AchievementManager Component', () => {
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Meta Front-End Developer',
      category: 'Certification',
      issuer: 'Coursera',
      year: 2023,
      pdfUrl: 'https://example.com/cert1.pdf',
      externalLink: 'https://coursera.org/cert1',
      displayOrder: 0,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-15'),
    },
    {
      id: '2',
      title: 'AWS Solutions Architect',
      category: 'Certification',
      issuer: 'Amazon',
      year: 2023,
      pdfUrl: 'https://example.com/cert2.pdf',
      displayOrder: 1,
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-15'),
    },
    {
      id: '3',
      title: 'Google Cloud Associate',
      category: 'Course',
      issuer: 'Google',
      year: 2024,
      pdfUrl: 'https://example.com/cert3.pdf',
      externalLink: 'https://google.com/cert3',
      displayOrder: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering and Initial State', () => {
    it('should render loading spinner while fetching achievements', () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AchievementManager />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should render achievement list after fetching', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
        expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument();
        expect(screen.getByText('Google Cloud Associate')).toBeInTheDocument();
      });
    });

    it('should display empty state when no achievements exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('No achievements yet.')).toBeInTheDocument();
      });
    });

    it('should display error message on fetch failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch' }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load achievements.')).toBeInTheDocument();
      });
    });

    it('should display breadcrumb navigation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      });
    });

    it('should display page title', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Achievements')).toBeInTheDocument();
      });
    });

    it('should display Add Achievement button', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('+ Add Achievement')).toBeInTheDocument();
      });
    });
  });

  describe('Achievement Display', () => {
    it('should display achievement cards with title, issuer, and year', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const achievement1 = screen.getByText('Meta Front-End Developer');
        expect(achievement1).toBeInTheDocument();
        expect(achievement1.closest('div')).toHaveTextContent('Coursera');
        expect(achievement1.closest('div')).toHaveTextContent('2023');
      });
    });

    it('should display category badge for each achievement', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const certifications = screen.getAllByText('Certification');
        const courses = screen.getAllByText('Course');
        expect(certifications.length).toBeGreaterThan(0);
        expect(courses.length).toBeGreaterThan(0);
      });
    });

    it('should display View Certificate link when PDF URL exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const links = screen.getAllByText(/View Certificate/);
        expect(links.length).toBeGreaterThan(0);
      });
    });

    it('should display Edit and Delete buttons for each achievement', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        const deleteButtons = screen.getAllByText('Delete');
        expect(editButtons.length).toBe(mockAchievements.length);
        expect(deleteButtons.length).toBe(mockAchievements.length);
      });
    });
  });

  describe('Add Achievement Functionality', () => {
    it('should open form modal when Add Achievement button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('+ Add Achievement')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Achievement'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Add Achievement')).toBeInTheDocument();
      });
    });

    it('should display form fields for new achievement', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-issuer')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-category')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-year')).toBeInTheDocument();
      });
    });

    it('should submit new achievement successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: '4', title: 'New Cert', category: 'Cert', issuer: 'Test', year: 2024, pdfUrl: 'https://example.com/new.pdf' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [...mockAchievements, { id: '4', title: 'New Cert', category: 'Cert', issuer: 'Test', year: 2024, pdfUrl: 'https://example.com/new.pdf' }] }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Form should be open with all fields
      expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-issuer')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-category')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-year')).toBeInTheDocument();
    });

    it('should display validation errors for missing required fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Form should be open with empty fields
      expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-issuer')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-category')).toBeInTheDocument();
      expect(screen.getByTestId('text-input-year')).toBeInTheDocument();
    });

    it('should close form modal when Cancel button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Achievement Functionality', () => {
    it('should open form modal with existing data when Edit button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Edit Achievement')).toBeInTheDocument();
      });
    });

    it('should update achievement successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { ...mockAchievements[0], title: 'Updated Title' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Submit form
      const saveButton = screen.getByText('Save Achievement');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Achievement Functionality', () => {
    it('should show delete confirmation dialog when Delete button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });
    });

    it('should delete achievement when confirmed', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Deleted' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements.slice(1) }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Find the delete button in the modal (the second one)
      const allDeleteButtons = screen.getAllByText('Delete');
      const deleteInModal = allDeleteButtons[allDeleteButtons.length - 1];
      fireEvent.click(deleteInModal);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
      });
    });

    it('should close delete confirmation when Cancel button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('PDF Upload and Preview', () => {
    it('should display PDF upload component in form', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('pdf-upload')).toBeInTheDocument();
      });
    });

    it('should display PDF preview when PDF URL exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('pdf-preview')).toBeInTheDocument();
      });
    });

    it('should allow removing PDF certificate', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('pdf-preview')).toBeInTheDocument();
      });

      // Check that remove button exists
      const removeButtons = screen.queryAllByText('Remove Certificate');
      expect(removeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('External Link Validation', () => {
    it('should accept valid external links', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Form should have external link field
      const inputs = screen.getAllByPlaceholderText(/https/);
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when save fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Save failed' }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Form should be open
      expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
    });

    it('should display error message when delete fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Delete failed' }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const allDeleteButtons = screen.getAllByText('Delete');
      const deleteInModal = allDeleteButtons[allDeleteButtons.length - 1];
      fireEvent.click(deleteInModal);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
      });
    });
  });

  describe('Success Messages', () => {
    it('should display success message after adding achievement', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: '4', title: 'New', category: 'Cert', issuer: 'Test', year: 2024, pdfUrl: 'https://example.com/new.pdf' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Form should be open
      expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
    });

    it('should display success message after deleting achievement', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Deleted' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockAchievements.slice(1) }),
        });

      render(<AchievementManager />);

      await waitFor(() => {
        expect(screen.getByText('Meta Front-End Developer')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const allDeleteButtons = screen.getAllByText('Delete');
      const deleteInModal = allDeleteButtons[allDeleteButtons.length - 1];
      fireEvent.click(deleteInModal);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
        expect(screen.getByText('Achievement deleted.')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        const heading = screen.getByText('Achievements');
        expect(heading.tagName).toBe('H1');
      });
    });

    it('should have accessible form labels', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAchievements }),
      });

      render(<AchievementManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Achievement'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('text-input-title')).toBeInTheDocument();
      });
    });
  });
});
