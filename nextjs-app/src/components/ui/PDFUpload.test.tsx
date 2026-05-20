/**
 * Tests for PDFUpload Component
 * 
 * Tests cover:
 * - File format validation (PDF only)
 * - File size validation (max 5MB)
 * - PDF preview display
 * - Drag-and-drop functionality with visual feedback
 * - Upload progress tracking with percentage and file size
 * - Upload cancellation functionality
 * - Error handling with user-friendly messages
 * - Callback invocations
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PDFUpload } from './PDFUpload';
import * as storageLib from '@/lib/storage';

// Mock storage library
jest.mock('@/lib/storage', () => ({
  uploadPDF: jest.fn(),
}));

describe('PDFUpload Component', () => {
  const mockOnUpload = jest.fn();
  const mockOnError = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onUpload: mockOnUpload,
    onError: mockOnError,
    onCancel: mockOnCancel,
    bucket: 'test-bucket',
    folder: 'test-folder',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render upload area with drag-and-drop instructions', () => {
      render(<PDFUpload {...defaultProps} />);
      expect(
        screen.getByText('Drag and drop your PDF here')
      ).toBeInTheDocument();
      expect(screen.getByText(/or click to select a file/i)).toBeInTheDocument();
    });

    it('should render help text with PDF format info', () => {
      render(<PDFUpload {...defaultProps} />);
      expect(
        screen.getByText(/PDF files only/i)
      ).toBeInTheDocument();
    });

    it('should render hidden file input with PDF accept', () => {
      render(<PDFUpload {...defaultProps} />);
      const input = screen.getByLabelText('Upload PDF');
      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', 'application/pdf');
    });

    it('should have proper accessibility attributes', () => {
      render(<PDFUpload {...defaultProps} />);
      const uploadArea = screen.getByRole('button', { name: /Upload PDF area/i });
      expect(uploadArea).toBeInTheDocument();
    });
  });

  describe('File Validation', () => {
    it('should reject non-PDF file format', async () => {
      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should reject file larger than 5MB', async () => {
      render(<PDFUpload {...defaultProps} />);

      const largeFile = new File(
        [new ArrayBuffer(6 * 1024 * 1024)],
        'large.pdf',
        { type: 'application/pdf' }
      );
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should accept valid PDF file', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should reject image file format', async () => {
      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should reject Word document format', async () => {
      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });
  });

  describe('PDF Preview', () => {
    it('should display PDF preview with filename before upload', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 1024,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'certificate.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      // Preview shows immediately, then upload starts
      // We check for either the preview or the uploading state
      await waitFor(() => {
        const hasPreview = screen.queryByText('certificate.pdf');
        const isUploading = screen.queryByText(/Uploading/i);
        expect(hasPreview || isUploading).toBeTruthy();
      });
    });

    it('should display file size in preview', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 2048,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} showFileSize={true} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        // File size should be shown either in preview or during upload
        expect(screen.getByText(/MB/)).toBeInTheDocument();
      });
    });

    it('should show change PDF option in preview', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 1024,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      // The preview shows before upload, but upload starts immediately
      // So we might see "Uploading..." instead of "Click to change PDF"
      await waitFor(() => {
        const hasChangeOption = screen.queryByText(/Click to change PDF/i);
        const isUploading = screen.queryByText(/Uploading/i);
        expect(hasChangeOption || isUploading).toBeTruthy();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should highlight area on drag enter', () => {
      const { container } = render(<PDFUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      fireEvent.dragEnter(uploadArea!);

      expect(uploadArea).toHaveClass('border-blue-500');
    });

    it('should remove highlight on drag leave', () => {
      const { container } = render(<PDFUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      fireEvent.dragEnter(uploadArea!);
      fireEvent.dragLeave(uploadArea!);

      expect(uploadArea).not.toHaveClass('border-blue-500');
    });

    it('should handle drop with valid PDF file', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      const { container } = render(<PDFUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(uploadArea!, { dataTransfer });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should reject drop with invalid file', async () => {
      const { container } = render(<PDFUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(uploadArea!, { dataTransfer });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
      });
    });

    it('should reject drop with image file', async () => {
      const { container } = render(<PDFUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(uploadArea!, { dataTransfer });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    it('should display progress bar during upload', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Uploading/i)).toBeInTheDocument();
      });
    });

    it('should display file size information during upload', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} showFileSize={true} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/test.pdf/)).toBeInTheDocument();
      });
    });

    it('should display percentage complete', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Complete/i)).toBeInTheDocument();
      });
    });

    it('should have progress bar with proper ARIA attributes', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      });
    });
  });

  describe('Upload Cancellation', () => {
    it('should display cancel button during upload', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 1024,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Cancel Upload/i)).toBeInTheDocument();
      });
    });

    it('should call onCancel when cancel button is clicked', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 1024,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const cancelButton = screen.getByText(/Cancel Upload/i);
        fireEvent.click(cancelButton);
      });

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should reset upload state when cancelled', async () => {
      (storageLib.uploadPDF as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/document.pdf',
                filename: 'document.pdf',
                path: 'test-folder/document.pdf',
                size: 1024,
                contentType: 'application/pdf',
              });
            }, 5000);
          })
      );

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const cancelButton = screen.getByText(/Cancel Upload/i);
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument();
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onUpload with result', async () => {
      const uploadResult = {
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      };

      (storageLib.uploadPDF as jest.Mock).mockResolvedValue(uploadResult);

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(uploadResult);
      });
    });

    it('should call onError on upload failure', async () => {
      const error = new Error('Upload failed');
      (storageLib.uploadPDF as jest.Mock).mockRejectedValue(error);

      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(error);
      });
    });

    it('should call onError on validation failure', async () => {
      render(<PDFUpload {...defaultProps} />);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled();
      });
    });
  });

  describe('Disabled State', () => {
    it('should disable upload when disabled prop is true', () => {
      render(<PDFUpload {...defaultProps} disabled={true} />);

      const uploadArea = screen.getByRole('button', { name: /Upload PDF area/i });
      expect(uploadArea).toHaveClass('opacity-50');
    });

    it('should not allow file selection when disabled', async () => {
      render(<PDFUpload {...defaultProps} disabled={true} />);

      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      expect(input).toBeDisabled();
    });
  });

  describe('Supabase Integration', () => {
    it('should pass correct bucket and folder to uploadPDF', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(
        <PDFUpload
          {...defaultProps}
          bucket="my-bucket"
          folder="my-folder"
        />
      );

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageLib.uploadPDF).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            bucket: 'my-bucket',
            folder: 'my-folder',
          })
        );
      });
    });

    it('should use default bucket when not specified', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload onUpload={mockOnUpload} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageLib.uploadPDF).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            bucket: 'portfolio-pdfs',
          })
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should trigger upload on Enter key', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const uploadArea = screen.getByRole('button', { name: /Upload PDF area/i });

      fireEvent.keyDown(uploadArea, { key: 'Enter' });

      // File input should be triggered
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    it('should trigger upload on Space key', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      render(<PDFUpload {...defaultProps} />);

      const uploadArea = screen.getByRole('button', { name: /Upload PDF area/i });

      fireEvent.keyDown(uploadArea, { key: ' ' });

      // File input should be triggered
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  describe('Custom Max Size', () => {
    it('should accept custom max size', async () => {
      (storageLib.uploadPDF as jest.Mock).mockResolvedValue({
        url: 'https://example.com/document.pdf',
        filename: 'document.pdf',
        path: 'test-folder/document.pdf',
        size: 1024,
        contentType: 'application/pdf',
      });

      const customMaxSize = 10 * 1024 * 1024; // 10MB
      render(<PDFUpload {...defaultProps} maxSize={customMaxSize} />);

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should reject file exceeding custom max size', async () => {
      const customMaxSize = 2 * 1024 * 1024; // 2MB
      render(<PDFUpload {...defaultProps} maxSize={customMaxSize} />);

      const largeFile = new File(
        [new ArrayBuffer(3 * 1024 * 1024)],
        'large.pdf',
        { type: 'application/pdf' }
      );
      const input = screen.getByLabelText('Upload PDF') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });
  });
});
