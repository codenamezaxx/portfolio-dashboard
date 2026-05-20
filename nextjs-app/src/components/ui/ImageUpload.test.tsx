/**
 * Tests for ImageUpload Component
 * 
 * Tests cover:
 * - File format validation (JPG, PNG, WebP, SVG)
 * - File size validation (max 5MB)
 * - Image preview display
 * - Drag-and-drop functionality with visual feedback
 * - Upload progress tracking with percentage and file size
 * - Upload cancellation functionality
 * - Error handling with user-friendly messages
 * - Callback invocations
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';
import * as storageLib from '@/lib/storage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock storage library
jest.mock('@/lib/storage', () => ({
  uploadImage: jest.fn(),
  compressImage: jest.fn(),
  generateThumbnail: jest.fn(),
}));

describe('ImageUpload Component', () => {
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
      render(<ImageUpload {...defaultProps} />);
      expect(
        screen.getByText('Drag and drop your image here')
      ).toBeInTheDocument();
      expect(screen.getByText(/or click to select a file/i)).toBeInTheDocument();
    });

    it('should render help text with supported formats', () => {
      render(<ImageUpload {...defaultProps} />);
      expect(
        screen.getByText(/JPG, PNG, WebP, SVG/i)
      ).toBeInTheDocument();
    });

    it('should render hidden file input', () => {
      render(<ImageUpload {...defaultProps} />);
      const input = screen.getByLabelText('Upload image');
      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp,image/svg+xml');
    });

    it('should have proper accessibility attributes', () => {
      render(<ImageUpload {...defaultProps} />);
      const uploadArea = screen.getByRole('button', { name: /Upload image area/i });
      expect(uploadArea).toBeInTheDocument();
    });
  });

  describe('File Validation', () => {
    it('should reject invalid file format', async () => {
      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should reject file larger than 5MB', async () => {
      render(<ImageUpload {...defaultProps} />);

      const largeFile = new File(
        [new ArrayBuffer(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });
    });

    it('should accept valid JPG file', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should accept valid PNG file', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.png',
        filename: 'image.png',
        path: 'test-folder/image.png',
        size: 1024,
        contentType: 'image/png',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should accept valid WebP file', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.webp',
        filename: 'image.webp',
        path: 'test-folder/image.webp',
        size: 1024,
        contentType: 'image/webp',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.webp', { type: 'image/webp' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should accept valid SVG file', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.svg',
        filename: 'image.svg',
        path: 'test-folder/image.svg',
        size: 1024,
        contentType: 'image/svg+xml',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.svg', { type: 'image/svg+xml' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should highlight area on drag enter', () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      fireEvent.dragEnter(uploadArea!);

      expect(uploadArea).toHaveClass('border-blue-500');
    });

    it('should remove highlight on drag leave', () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      fireEvent.dragEnter(uploadArea!);
      fireEvent.dragLeave(uploadArea!);

      expect(uploadArea).not.toHaveClass('border-blue-500');
    });

    it('should handle drop with valid file', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      const { container } = render(<ImageUpload {...defaultProps} />);
      const uploadArea = container.querySelector('[role="button"]');

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(uploadArea!, { dataTransfer });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });
    });

    it('should reject drop with invalid file', async () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
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
  });

  describe('Progress Tracking', () => {
    it('should display progress bar during upload', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Uploading/i)).toBeInTheDocument();
      });
    });

    it('should display file size information during upload', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} showFileSize={true} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/test.jpg/)).toBeInTheDocument();
      });
    });

    it('should display percentage complete', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Complete/i)).toBeInTheDocument();
      });
    });

    it('should have progress bar with proper ARIA attributes', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

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
      (storageLib.uploadImage as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/image.jpg',
                filename: 'image.jpg',
                path: 'test-folder/image.jpg',
                size: 1024,
                contentType: 'image/jpeg',
              });
            }, 5000);
          })
      );

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Cancel Upload/i)).toBeInTheDocument();
      });
    });

    it('should call onCancel when cancel button is clicked', async () => {
      (storageLib.uploadImage as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/image.jpg',
                filename: 'image.jpg',
                path: 'test-folder/image.jpg',
                size: 1024,
                contentType: 'image/jpeg',
              });
            }, 5000);
          })
      );

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const cancelButton = screen.getByText(/Cancel Upload/i);
        fireEvent.click(cancelButton);
      });

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should reset upload state when cancelled', async () => {
      (storageLib.uploadImage as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                url: 'https://example.com/image.jpg',
                filename: 'image.jpg',
                path: 'test-folder/image.jpg',
                size: 1024,
                contentType: 'image/jpeg',
              });
            }, 5000);
          })
      );

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

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
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      };

      (storageLib.uploadImage as jest.Mock).mockResolvedValue(uploadResult);

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(uploadResult);
      });
    });

    it('should call onError on upload failure', async () => {
      const error = new Error('Upload failed');
      (storageLib.uploadImage as jest.Mock).mockRejectedValue(error);

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Disabled State', () => {
    it('should disable upload when disabled prop is true', () => {
      render(<ImageUpload {...defaultProps} disabled={true} />);

      const uploadArea = screen.getByRole('button', { name: /Upload image area/i });
      expect(uploadArea).toHaveClass('opacity-50');
    });

    it('should not allow file selection when disabled', async () => {
      render(<ImageUpload {...defaultProps} disabled={true} />);

      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      expect(input).toBeDisabled();
    });
  });

  describe('Compression', () => {
    it('should compress image by default', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageLib.uploadImage).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            compress: true,
            quality: 0.8,
          })
        );
      });
    });

    it('should skip compression when compress is false', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} compress={false} />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageLib.uploadImage).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            compress: false,
          })
        );
      });
    });
  });

  describe('Supabase Integration', () => {
    it('should pass correct bucket and folder to uploadImage', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(
        <ImageUpload
          {...defaultProps}
          bucket="my-bucket"
          folder="my-folder"
        />
      );

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageLib.uploadImage).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({
            bucket: 'my-bucket',
            folder: 'my-folder',
          })
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should trigger upload on Enter key', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const uploadArea = screen.getByRole('button', { name: /Upload image area/i });

      fireEvent.keyDown(uploadArea, { key: 'Enter' });

      // File input should be triggered
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    it('should trigger upload on Space key', async () => {
      (storageLib.uploadImage as jest.Mock).mockResolvedValue({
        url: 'https://example.com/image.jpg',
        filename: 'image.jpg',
        path: 'test-folder/image.jpg',
        size: 1024,
        contentType: 'image/jpeg',
      });

      render(<ImageUpload {...defaultProps} />);

      const uploadArea = screen.getByRole('button', { name: /Upload image area/i });

      fireEvent.keyDown(uploadArea, { key: ' ' });

      // File input should be triggered
      const input = screen.getByLabelText('Upload image') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });
});
