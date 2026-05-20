import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Modal,
  ConfirmationDialog,
  DeleteConfirmationDialog,
  AlertDialog,
} from './Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Modal
          isOpen={false}
          onClose={jest.fn()}
          title="Test Modal"
          message="Test message"
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          message="Test message"
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render with custom title and message', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Custom Title"
          message="Custom message content"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom message content')).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
        >
          <div>Custom child content</div>
        </Modal>
      );

      expect(screen.getByText('Custom child content')).toBeInTheDocument();
    });

    it('should render close button by default', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
        />
      );

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should not render close button when closeButton is false', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          closeButton={false}
        />
      );

      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const handleConfirm = jest.fn();
      const handleCancel = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[
            { label: 'Cancel', onClick: handleCancel },
            { label: 'Confirm', onClick: handleConfirm },
          ]}
        />
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should call action onClick handler when button is clicked', async () => {
      const handleConfirm = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[{ label: 'Confirm', onClick: handleConfirm }]}
        />
      );

      const confirmButton = screen.getByText('Confirm');
      await userEvent.click(confirmButton);

      expect(handleConfirm).toHaveBeenCalled();
    });

    it('should support async action handlers', async () => {
      const handleConfirm = jest.fn().mockResolvedValue(undefined);

      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[{ label: 'Confirm', onClick: handleConfirm }]}
        />
      );

      const confirmButton = screen.getByText('Confirm');
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(handleConfirm).toHaveBeenCalled();
      });
    });

    it('should support action variants', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[
            { label: 'Delete', onClick: jest.fn(), variant: 'danger' },
          ]}
        />
      );

      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toHaveClass('bg-red-600');
    });

    it('should support loading state on actions', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[
            { label: 'Confirm', onClick: jest.fn(), isLoading: true },
          ]}
        />
      );

      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toBeDisabled();
    });

    it('should support disabled state on actions', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          actions={[
            { label: 'Confirm', onClick: jest.fn(), disabled: true },
          ]}
        />
      );

      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const handleClose = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalled();
    });

    it('should call onClose when overlay is clicked and isDismissible is true', async () => {
      const handleClose = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
          isDismissible={true}
        />
      );

      // Get the overlay (the first div with the semi-transparent background)
      const overlays = document.querySelectorAll('div[aria-hidden="true"]');
      if (overlays.length > 0) {
        fireEvent.click(overlays[0]);
      }

      expect(handleClose).toHaveBeenCalled();
    });

    it('should not call onClose when overlay is clicked and isDismissible is false', async () => {
      const handleClose = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
          isDismissible={false}
        />
      );

      // Get the overlay (the first div with the semi-transparent background)
      const overlays = document.querySelectorAll('div[aria-hidden="true"]');
      if (overlays.length > 0) {
        fireEvent.click(overlays[0]);
      }

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed and isDismissible is true', () => {
      const handleClose = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
          isDismissible={true}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleClose).toHaveBeenCalled();
    });

    it('should not call onClose when Escape key is pressed and isDismissible is false', () => {
      const handleClose = jest.fn();

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Test Modal"
          isDismissible={false}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          message="Test message"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    });

    it('should not have aria-describedby when message is not provided', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).not.toHaveAttribute('aria-describedby');
    });

    it('should have proper focus management', () => {
      const { rerender } = render(
        <Modal
          isOpen={false}
          onClose={jest.fn()}
          title="Test Modal"
        />
      );

      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      rerender(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveFocus();

      document.body.removeChild(button);
    });
  });

  describe('Sizing', () => {
    it('should render with small size', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          size="sm"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.firstChild).toHaveClass('max-w-sm');
    });

    it('should render with medium size', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          size="md"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.firstChild).toHaveClass('max-w-md');
    });

    it('should render with large size', () => {
      render(
        <Modal
          isOpen={true}
          onClose={jest.fn()}
          title="Test Modal"
          size="lg"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.firstChild).toHaveClass('max-w-lg');
    });
  });
});

describe('ConfirmationDialog Component', () => {
  it('should render with default labels', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should render with custom labels', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const handleConfirm = jest.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={handleConfirm}
      />
    );

    const confirmButton = screen.getByText('Confirm');
    await userEvent.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const handleClose = jest.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={handleClose}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={jest.fn()}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it('should disable buttons when isConfirming is true', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={jest.fn()}
        isConfirming={true}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    const confirmButton = screen.getByText('Confirm');

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('should support custom confirm variant', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Confirm Action"
        message="Are you sure?"
        confirmVariant="danger"
        onConfirm={jest.fn()}
      />
    );

    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});

describe('DeleteConfirmationDialog Component', () => {
  it('should render with delete-specific defaults', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should include item name in message when provided', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        itemName="Test Project"
      />
    );

    expect(
      screen.getByText(/Are you sure you want to delete "Test Project"/)
    ).toBeInTheDocument();
  });

  it('should use custom message when provided', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        message="Custom delete message"
      />
    );

    expect(screen.getByText('Custom delete message')).toBeInTheDocument();
  });

  it('should use danger variant for confirm button', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toHaveClass('bg-red-600');
  });

  it('should call onConfirm when delete button is clicked', async () => {
    const handleConfirm = jest.fn();

    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={handleConfirm}
      />
    );

    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);

    expect(handleConfirm).toHaveBeenCalled();
  });
});

describe('AlertDialog Component', () => {
  it('should render with default action label', () => {
    render(
      <AlertDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Alert"
        message="Alert message"
      />
    );

    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should render with custom action label', () => {
    render(
      <AlertDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Alert"
        message="Alert message"
        actionLabel="Dismiss"
      />
    );

    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('should call onAction and onClose when action button is clicked', async () => {
    const handleAction = jest.fn();
    const handleClose = jest.fn();

    render(
      <AlertDialog
        isOpen={true}
        onClose={handleClose}
        title="Alert"
        message="Alert message"
        onAction={handleAction}
      />
    );

    const actionButton = screen.getByText('OK');
    await userEvent.click(actionButton);

    expect(handleAction).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('should support different variants', () => {
    const { rerender } = render(
      <AlertDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Alert"
        message="Alert message"
        variant="error"
      />
    );

    let actionButton = screen.getByText('OK');
    expect(actionButton).toHaveClass('bg-red-600');

    rerender(
      <AlertDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Alert"
        message="Alert message"
        variant="success"
      />
    );

    actionButton = screen.getByText('OK');
    expect(actionButton).toHaveClass('bg-blue-600');
  });
});
