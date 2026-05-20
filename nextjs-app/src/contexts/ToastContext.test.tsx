import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from './ToastContext';
import { useToast } from '@/hooks/useToast';

// Test component that uses the useToast hook
const TestComponent = () => {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success!')}>
        Show Success
      </button>
      <button onClick={() => toast.error('Error!')}>
        Show Error
      </button>
      <button onClick={() => toast.warning('Warning!')}>
        Show Warning
      </button>
      <button onClick={() => toast.info('Info!')}>
        Show Info
      </button>
      <button onClick={() => toast.clearToasts()}>
        Clear All
      </button>
      <div data-testid="toast-count">{toast.toasts.length}</div>
    </div>
  );
};

describe('ToastContext', () => {
  describe('ToastProvider', () => {
    it('should provide toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
    });

    it('should throw error when useToast is used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleError.mockRestore();
    });
  });

  describe('addToast', () => {
    it('should add a success toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Success');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('should add an error toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Error');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
    });

    it('should add a warning toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Warning');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });

    it('should add an info toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Info');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Info!')).toBeInTheDocument();
      });
    });

    it('should return a unique toast ID', async () => {
      let id1: string;
      let id2: string;

      const TestComponentWithIds = () => {
        const toast = useToast();

        return (
          <div>
            <button
              onClick={() => {
                id1 = toast.success('Toast 1');
              }}
            >
              Add Toast 1
            </button>
            <button
              onClick={() => {
                id2 = toast.success('Toast 2');
              }}
            >
              Add Toast 2
            </button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithIds />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Add Toast 1'));
      fireEvent.click(screen.getByText('Add Toast 2'));

      await waitFor(() => {
        expect(id1).toBeDefined();
        expect(id2).toBeDefined();
        expect(id1).not.toBe(id2);
      });
    });

    it('should respect maxToasts limit', async () => {
      render(
        <ToastProvider maxToasts={2}>
          <TestComponent />
        </ToastProvider>
      );

      const successButton = screen.getByText('Show Success');
      const errorButton = screen.getByText('Show Error');
      const warningButton = screen.getByText('Show Warning');

      fireEvent.click(successButton);
      fireEvent.click(errorButton);
      fireEvent.click(warningButton);

      await waitFor(() => {
        const toastCount = screen.getByTestId('toast-count');
        expect(toastCount).toHaveTextContent('2');
      });
    });

    it('should support custom duration', async () => {
      const TestComponentWithDuration = () => {
        const toast = useToast();

        return (
          <button
            onClick={() => toast.success('Quick toast', { duration: 1000 })}
          >
            Show Quick Toast
          </button>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithDuration />
        </ToastProvider>
      );

      const button = screen.getByText('Show Quick Toast');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Quick toast')).toBeInTheDocument();
      });
    });

    it('should support action button', async () => {
      const mockAction = jest.fn();

      const TestComponentWithAction = () => {
        const toast = useToast();

        return (
          <button
            onClick={() =>
              toast.success('Toast with action', {
                action: {
                  label: 'Undo',
                  onClick: mockAction,
                },
              })
            }
          >
            Show Toast with Action
          </button>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithAction />
        </ToastProvider>
      );

      const button = screen.getByText('Show Toast with Action');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Toast with action')).toBeInTheDocument();
      });
    });
  });

  describe('removeToast', () => {
    it('should remove a specific toast', async () => {
      const TestComponentWithRemove = () => {
        const toast = useToast();
        const [toastId, setToastId] = React.useState<string>('');

        return (
          <div>
            <button
              onClick={() => {
                const id = toast.success('Toast to remove');
                setToastId(id);
              }}
            >
              Add Toast
            </button>
            <button onClick={() => toast.removeToast(toastId)}>
              Remove Toast
            </button>
            <div data-testid="toast-count">{toast.toasts.length}</div>
          </div>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithRemove />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Add Toast'));

      await waitFor(() => {
        expect(screen.getByText('Toast to remove')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Remove Toast'));

      await waitFor(() => {
        expect(screen.queryByText('Toast to remove')).not.toBeInTheDocument();
      });
    });
  });

  describe('clearToasts', () => {
    it('should clear all toasts', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const successButton = screen.getByText('Show Success');
      const errorButton = screen.getByText('Show Error');
      const clearButton = screen.getByText('Clear All');

      fireEvent.click(successButton);
      fireEvent.click(errorButton);

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });

      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
        expect(screen.queryByText('Error!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Convenience methods', () => {
    it('success method should add success toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('error method should add error toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Error'));

      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
    });

    it('warning method should add warning toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });

    it('info method should add info toast', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Info'));

      await waitFor(() => {
        expect(screen.getByText('Info!')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple toasts', () => {
    it('should display multiple toasts simultaneously', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });
  });
});
