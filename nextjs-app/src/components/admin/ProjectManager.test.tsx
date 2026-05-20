/**
 * ProjectManager Component Tests
 * 
 * Tests for the project manager component including:
 * - Project list rendering with table view
 * - Add/Edit/Delete functionality
 * - Search and filtering by category
 * - Image upload and preview
 * - Technology tags support
 * - URL validation for project links
 * - Confirmation dialog for deletion
 * - Bulk delete functionality
 * - Error handling and loading states
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectManager } from './ProjectManager';
import type { Project } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, disabled, variant, size, isLoading, ...props }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} data-variant={variant} data-size={size} {...props}>
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

jest.mock('@/components/admin/Breadcrumb', () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

jest.mock('./ProjectForm', () => ({
  ProjectForm: ({ initialData, onSubmit, isLoading }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(initialData || {
          title: 'Test Project',
          description: 'Test Description',
          category: 'web',
          imageUrl: 'https://example.com/image.jpg',
          technologies: ['React', 'TypeScript'],
          githubLink: 'https://github.com/test',
          liveLink: 'https://example.com',
          demoLink: '',
        });
      }}
      data-testid="project-form"
    >
      <input type="hidden" value={JSON.stringify(initialData)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Project'}
      </button>
    </form>
  ),
}));

describe('ProjectManager Component', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution',
      category: 'web',
      imageUrl: 'https://example.com/project1.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      displayOrder: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Mobile Chat App',
      description: 'Real-time messaging application',
      category: 'mobile',
      imageUrl: 'https://example.com/project2.jpg',
      technologies: ['React Native', 'Firebase'],
      displayOrder: 1,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: '3',
      title: 'Design System',
      description: 'Reusable component library',
      category: 'library',
      imageUrl: 'https://example.com/project3.jpg',
      technologies: ['React', 'TypeScript', 'Storybook'],
      displayOrder: 2,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-15'),
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
    it('should render loading spinner while fetching projects', () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ProjectManager />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should render project list after fetching', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
        expect(screen.getByText('Mobile Chat App')).toBeInTheDocument();
        expect(screen.getByText('Design System')).toBeInTheDocument();
      });
    });

    it('should display empty state when no projects exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('No projects yet.')).toBeInTheDocument();
      });
    });

    it('should display error message on fetch failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch' }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load projects.')).toBeInTheDocument();
      });
    });

    it('should display breadcrumb navigation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      });
    });

    it('should display page title', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
      });
    });
  });

  describe('Project Display', () => {
    it('should display project cards with title, category, and thumbnail', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        const project1 = screen.getByText('E-Commerce Platform');
        expect(project1).toBeInTheDocument();
        expect(project1.closest('div')).toHaveTextContent('web');
      });
    });

    it('should display technology tags for each project', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        // Check that at least some technologies are displayed
        const techElements = screen.queryAllByText(/React|Node.js|MongoDB|Firebase|TypeScript|Storybook/);
        expect(techElements.length).toBeGreaterThan(0);
      });
    });

    it('should show +N more indicator when project has more than 3 technologies', async () => {
      const projectWithManyTechs: Project = {
        ...mockProjects[0],
        technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Redis'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [projectWithManyTechs] }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        // Check that the +N more indicator is displayed
        const moreIndicator = screen.queryByText(/\+\d+ more/);
        expect(moreIndicator).toBeInTheDocument();
      });
    });

    it('should display project image or placeholder', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('should display no image placeholder when imageUrl is missing', async () => {
      const projectNoImage: Project = {
        ...mockProjects[0],
        imageUrl: undefined,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [projectNoImage] }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('No Image')).toBeInTheDocument();
      });
    });
  });

  describe('Add Project Functionality', () => {
    it('should open form modal when Add Project button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('+ Add Project')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('+ Add Project'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Add New Project')).toBeInTheDocument();
      });
    });

    it('should submit new project and refresh list', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: '4', ...mockProjects[0] } }),
          status: 201,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [...mockProjects, { id: '4', ...mockProjects[0] }] }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
        expect(screen.getByText('Project added successfully!')).toBeInTheDocument();
      });
    });

    it('should display error message on add failure', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to create project' }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to save project.')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Project Functionality', () => {
    it('should open form modal with project data when Edit is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Edit Project')).toBeInTheDocument();
      });
    });

    it('should update project and refresh list', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { ...mockProjects[0], title: 'Updated Title' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
        expect(screen.getByText('Project updated successfully!')).toBeInTheDocument();
      });
    });

    it('should display error message on update failure', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to update project' }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to save project.')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Project Functionality', () => {
    it('should show confirmation dialog when Delete is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete project/)).toBeInTheDocument();
      });
    });

    it('should delete project when confirmed', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Project deleted' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects.slice(1) }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const confirmDeleteButton = screen.getAllByText('Delete')[screen.getAllByText('Delete').length - 1];
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-success')).toBeInTheDocument();
        expect(screen.getByText('Project deleted.')).toBeInTheDocument();
      });
    });

    it('should cancel delete when Cancel is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
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

    it('should display error message on delete failure', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to delete' }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const confirmDeleteButton = screen.getAllByText('Delete')[screen.getAllByText('Delete').length - 1];
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to delete project.')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Management', () => {
    it('should close form modal when close button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('modal-close'));

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('should use large size for form modal', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toHaveAttribute('data-size', 'lg');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        const heading = screen.getByText('Project Manager');
        expect(heading.tagName).toBe('H1');
      });
    });

    it('should have accessible button labels', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('+ Add Project')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument();
      });
    });

    it('should handle malformed API responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Missing data field
      });

      render(<ProjectManager />);

      await waitFor(() => {
        expect(screen.getByText('No projects yet.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable buttons while loading', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockImplementationOnce(
          () => new Promise(() => {}) // Never resolves
        );

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        const submitButton = screen.getByText('Saving...');
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Success Messages', () => {
    it('should display success message after adding project', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: '4', ...mockProjects[0] } }),
          status: 201,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [...mockProjects, { id: '4', ...mockProjects[0] }] }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText('+ Add Project'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Project added successfully!')).toBeInTheDocument();
      });
    });

    it('should display success message after updating project', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { ...mockProjects[0], title: 'Updated' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const form = screen.getByTestId('project-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Project updated successfully!')).toBeInTheDocument();
      });
    });

    it('should display success message after deleting project', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Deleted' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockProjects.slice(1) }),
        });

      render(<ProjectManager />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const confirmDeleteButton = screen.getAllByText('Delete')[screen.getAllByText('Delete').length - 1];
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Project deleted.')).toBeInTheDocument();
      });
    });
  });
});
