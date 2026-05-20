import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Toast, ToastContainer, type ToastMessage } from './Toast';

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Toast Rendering', () => {
    it('should render success toast with correct styling', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Success message',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toBeInTheDocument();
      expect(toastElement).toHaveClass('bg-green-50');
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should render error toast with correct styling', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Error message',
        type: 'error',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass('bg-red-50');
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render warning toast with correct styling', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Warning message',
        type: 'warning',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass('bg-yellow-50');
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('should render info toast with correct styling', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Info message',
        type: 'info',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass('bg-blue-50');
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Auto-dismiss Functionality', () => {
    it('should auto-dismiss after default duration (5000ms)', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Auto-dismiss test',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(5000);

      expect(mockOnClose).toHaveBeenCalledWith('1');
    });

    it('should auto-dismiss after custom duration', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Custom duration test',
        type: 'success',
        duration: 3000,
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      jest.advanceTimersByTime(2999);
      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockOnClose).toHaveBeenCalledWith('1');
    });

    it('should not auto-dismiss if duration is 0', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'No auto-dismiss test',
        type: 'success',
        duration: 0,
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      jest.advanceTimersByTime(10000);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should pause auto-dismiss on mouse enter', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Pause test',
        type: 'success',
        duration: 5000,
        onClose: mockOnClose,
      };

      const { container } = render(<Toast {...toast} />);
      const toastElement = container.querySelector('[role="alert"]');

      jest.advanceTimersByTime(3000);
      fireEvent.mouseEnter(toastElement!);

      jest.advanceTimersByTime(2000);
      expect(mockOnClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(5000);
      expect(mockOnClose).toHaveBeenCalledWith('1');
    });

    it('should resume auto-dismiss on mouse leave', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Resume test',
        type: 'success',
        duration: 5000,
        onClose: mockOnClose,
      };

      const { container } = render(<Toast {...toast} />);
      const toastElement = container.querySelector('[role="alert"]');

      jest.advanceTimersByTime(3000);
      fireEvent.mouseEnter(toastElement!);
      jest.advanceTimersByTime(2000);

      fireEvent.mouseLeave(toastElement!);
      jest.advanceTimersByTime(5000);

      expect(mockOnClose).toHaveBeenCalledWith('1');
    });
  });

  describe('Close Button', () => {
    it('should close toast when close button is clicked', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Close button test',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('1');
    });
  });

  describe('Action Button', () => {
    it('should render action button when provided', () => {
      const mockAction = jest.fn();
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Action test',
        type: 'success',
        action: {
          label: 'Undo',
          onClick: mockAction,
        },
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const actionButton = screen.getByText('Undo');
      expect(actionButton).toBeInTheDocument();
    });

    it('should call action onClick when action button is clicked', () => {
      const mockAction = jest.fn();
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Action click test',
        type: 'success',
        action: {
          label: 'Retry',
          onClick: mockAction,
        },
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const actionButton = screen.getByText('Retry');
      fireEvent.click(actionButton);

      expect(mockAction).toHaveBeenCalled();
    });

    it('should not render action button when not provided', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'No action test',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      expect(screen.queryByLabelText(/Undo|Retry/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Accessibility test',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveAttribute('aria-live', 'polite');
      expect(toastElement).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have accessible close button', () => {
      const toast: React.ComponentProps<typeof Toast> = {
        id: '1',
        message: 'Close button accessibility test',
        type: 'success',
        onClose: mockOnClose,
      };

      render(<Toast {...toast} />);

      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });
  });
});

describe('ToastContainer Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render multiple toasts', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
        { id: '2', message: 'Toast 2', type: 'error' },
        { id: '3', message: 'Toast 3', type: 'warning' },
      ];

      render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} />
      );

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();
      expect(screen.getByText('Toast 3')).toBeInTheDocument();
    });

    it('should render empty container when no toasts', () => {
      const { container } = render(
        <ToastContainer toasts={[]} onClose={mockOnClose} />
      );

      const alerts = container.querySelectorAll('[role="alert"]');
      expect(alerts).toHaveLength(0);
    });

    it('should limit toasts to maxToasts', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
        { id: '2', message: 'Toast 2', type: 'success' },
        { id: '3', message: 'Toast 3', type: 'success' },
        { id: '4', message: 'Toast 4', type: 'success' },
        { id: '5', message: 'Toast 5', type: 'success' },
        { id: '6', message: 'Toast 6', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} maxToasts={3} />
      );

      const alerts = container.querySelectorAll('[role="alert"]');
      expect(alerts).toHaveLength(3);
      expect(screen.getByText('Toast 4')).toBeInTheDocument();
      expect(screen.getByText('Toast 5')).toBeInTheDocument();
      expect(screen.getByText('Toast 6')).toBeInTheDocument();
      expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should apply top-right positioning by default', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} />
      );

      const containerElement = container.querySelector('[role="region"]');
      expect(containerElement).toHaveClass('top-4', 'right-4');
    });

    it('should apply top-left positioning', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer
          toasts={toasts}
          onClose={mockOnClose}
          position="top-left"
        />
      );

      const containerElement = container.querySelector('[role="region"]');
      expect(containerElement).toHaveClass('top-4', 'left-4');
    });

    it('should apply bottom-right positioning', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer
          toasts={toasts}
          onClose={mockOnClose}
          position="bottom-right"
        />
      );

      const containerElement = container.querySelector('[role="region"]');
      expect(containerElement).toHaveClass('bottom-4', 'right-4');
    });

    it('should apply bottom-left positioning', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer
          toasts={toasts}
          onClose={mockOnClose}
          position="bottom-left"
        />
      );

      const containerElement = container.querySelector('[role="region"]');
      expect(containerElement).toHaveClass('bottom-4', 'left-4');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA region attributes', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      const { container } = render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} />
      );

      const regionElement = container.querySelector('[role="region"]');
      expect(regionElement).toHaveAttribute('aria-label', 'Notifications');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when toast is closed', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
      ];

      render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} />
      );

      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('1');
    });
  });
});
