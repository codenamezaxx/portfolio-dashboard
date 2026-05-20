/**
 * Tests for JourneyEditor Component
 * 
 * Tests cover:
 * - Rendering and initial state
 * - Fetching journey items
 * - Adding new journey items
 * - Editing existing journey items
 * - Deleting journey items
 * - Form validation
 * - Error handling
 * - Drag and drop reordering
 * - Sorting by year
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JourneyEditor } from './JourneyEditor';
import type { JourneyItem } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/admin/journey',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockJourneyItems: JourneyItem[] = [
  {
    id: '1',
    year: '2020',
    title: 'Started Learning Web Development',
    description: 'Began my journey into web development with HTML, CSS, and JavaScript.',
    displayOrder: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    year: '2021 - 2022',
    title: 'Freelance Developer',
    description: 'Worked on various freelance projects building responsive websites.',
    displayOrder: 1,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    year: '2023 - Present',
    title: 'Full Stack Developer',
    description: 'Currently working as a full stack developer with React and Node.js.',
    displayOrder: 2,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

describe('JourneyEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Rendering and Initial State', () => {
    it('should render loading spinner when fetching data', () => {
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ data: mockJourneyItems }),
              });
            }, 100);
          })
      );

      render(<JourneyEditor />);
      const spinnerContainer = document.querySelector('.animate-spin');
      expect(spinnerContainer).toBeInTheDocument();
    });

    it('should render journey items when data is provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText('Started Learning Web Development')).toBeInTheDocument();
        expect(screen.getByText('Freelance Developer')).toBeInTheDocument();
      });
    });

    it('should render empty state when no items exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText('No journey milestones yet.')).toBeInTheDocument();
      });
    });

    it('should display page header', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText('Journey Manager')).toBeInTheDocument();
      });
    });

    it('should display add milestone button', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add milestone/i })).toBeInTheDocument();
      });
    });
  });

  describe('Fetching Journey Items', () => {
    it('should fetch journey items on mount', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/content/journey');
      });
    });

    it('should display error message when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch' }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load journey items/i)).toBeInTheDocument();
      });
    });
  });

  describe('Adding New Journey Items', () => {
    it('should open form modal when add milestone button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add milestone/i })).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add milestone/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add milestone/i })).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add milestone/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const yearErrors = screen.queryAllByText('Year is required');
        expect(yearErrors.length).toBeGreaterThan(0);
      });
    });

    it('should submit form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              id: '4',
              year: '2024',
              title: 'New Milestone',
              description: 'A new milestone in my journey',
              displayOrder: 3,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),
        });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const yearInput = screen.getByPlaceholderText(/e.g. 2023 or 2021 - Present/i);
      const titleInput = screen.getByPlaceholderText(/e.g. Software Engineer/i);
      const descriptionInput = screen.getByPlaceholderText(/describe your achievements/i);

      await userEvent.type(yearInput, '2024');
      await userEvent.type(titleInput, 'New Milestone');
      await userEvent.type(descriptionInput, 'A new milestone in my journey');

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/added successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Editing Journey Items', () => {
    it('should open form modal with existing data when edit button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /edit/i });
        expect(editButtons.length).toBeGreaterThan(0);
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Edit Milestone')).toBeInTheDocument();
      });

      const yearInput = screen.getByDisplayValue('2020');
      expect(yearInput).toBeInTheDocument();
    });

    it('should submit form with updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              id: '1',
              year: '2020 - 2021',
              title: 'Started Learning Web Development',
              description: 'Updated description',
              displayOrder: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }),
        });

      render(<JourneyEditor />);

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /edit/i });
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Edit Milestone')).toBeInTheDocument();
      });

      const descriptionInput = screen.getByDisplayValue('Began my journey into web development with HTML, CSS, and JavaScript.');
      await userEvent.clear(descriptionInput);
      await userEvent.type(descriptionInput, 'Updated description');

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Deleting Journey Items', () => {
    it('should open delete confirmation modal when delete button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });
    });

    it('should delete item when confirmed', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Deleted' }),
        });

      render(<JourneyEditor />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });

      const confirmButtons = screen.getAllByRole('button', { name: /^Delete$/ });
      fireEvent.click(confirmButtons[confirmButtons.length - 1]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/content/journey'),
          expect.objectContaining({
            method: 'DELETE',
          })
        );
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate year field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const yearErrors = screen.queryAllByText('Year is required');
        expect(yearErrors.length).toBeGreaterThan(0);
      });
    });

    it('should validate title field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const yearInput = screen.getByPlaceholderText(/e.g. 2023 or 2021 - Present/i);
      await userEvent.type(yearInput, '2024');

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const titleErrors = screen.queryAllByText('Title is required');
        expect(titleErrors.length).toBeGreaterThan(0);
      });
    });

    it('should validate description field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const yearInput = screen.getByPlaceholderText(/e.g. 2023 or 2021 - Present/i);
      const titleInput = screen.getByPlaceholderText(/e.g. Software Engineer/i);

      await userEvent.type(yearInput, '2024');
      await userEvent.type(titleInput, 'New Milestone');

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const descriptionErrors = screen.queryAllByText('Description is required');
        expect(descriptionErrors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Drag and Drop Reordering', () => {
    it('should display drag handle for each item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      const { container } = render(<JourneyEditor />);

      await waitFor(() => {
        const dragHandles = container.querySelectorAll('.cursor-move');
        expect(dragHandles.length).toBeGreaterThan(0);
      });
    });

    it('should reorder items when drag and drop is completed', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Order updated' }),
        });

      const { container } = render(<JourneyEditor />);

      await waitFor(() => {
        const items = container.querySelectorAll('[draggable="true"]');
        expect(items.length).toBeGreaterThan(0);
      });

      const items = container.querySelectorAll('[draggable="true"]');
      const firstItem = items[0] as HTMLElement;
      const secondItem = items[1] as HTMLElement;

      fireEvent.dragStart(firstItem);
      fireEvent.dragOver(secondItem);
      fireEvent.drop(secondItem);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/content/journey',
          expect.objectContaining({
            method: 'PUT',
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when adding item fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to save' }),
        });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const yearInput = screen.getByPlaceholderText(/e.g. 2023 or 2021 - Present/i);
      const titleInput = screen.getByPlaceholderText(/e.g. Software Engineer/i);
      const descriptionInput = screen.getByPlaceholderText(/describe your achievements/i);

      await userEvent.type(yearInput, '2024');
      await userEvent.type(titleInput, 'New Milestone');
      await userEvent.type(descriptionInput, 'A new milestone');

      const submitButton = screen.getByRole('button', { name: /^Save$/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
    });

    it('should display error message when deleting item fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockJourneyItems }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Failed to delete' }),
        });

      render(<JourneyEditor />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });

      const confirmButtons = screen.getAllByRole('button', { name: /^Delete$/ });
      fireEvent.click(confirmButtons[confirmButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText(/failed to delete/i)).toBeInTheDocument();
      });
    });
  });

  describe('Timeline Display', () => {
    it('should display year badge for each item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const yearBadges = screen.getAllByText(/2020|2021 - 2022|2023 - Present/);
        expect(yearBadges.length).toBeGreaterThan(0);
      });
    });

    it('should display title for each item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText('Started Learning Web Development')).toBeInTheDocument();
        expect(screen.getByText('Freelance Developer')).toBeInTheDocument();
        expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
      });
    });

    it('should display description for each item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        expect(screen.getByText(/Began my journey into web development/i)).toBeInTheDocument();
        expect(screen.getByText(/Worked on various freelance projects/i)).toBeInTheDocument();
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should close form modal when cancel button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add milestone/i });
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Add Milestone')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Add Milestone')).not.toBeInTheDocument();
      });
    });

    it('should close delete modal when cancel button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockJourneyItems }),
      });

      render(<JourneyEditor />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0];
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/are you sure you want to delete/i)).not.toBeInTheDocument();
      });
    });
  });
});
