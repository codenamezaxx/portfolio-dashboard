/**
 * Tests for Storage Utilities
 * 
 * Tests cover:
 * - Image compression
 * - Thumbnail generation
 * - File upload to Supabase Storage
 * - Batch upload with retry logic
 * - File deletion
 * - URL utilities
 * - Error handling (validation, upload, network, quota, permission)
 * - Retry logic with exponential backoff
 */

import {
  compressImage,
  generateThumbnail,
  uploadImage,
  uploadPDF,
  batchUpload,
  deleteFile,
  deleteFiles,
  getPublicUrl,
  extractPathFromUrl,
  ValidationError,
  UploadError,
  NetworkError,
  QuotaError,
  PermissionError,
  StorageError,
} from './storage';
import * as supabaseModule from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  })),
}));

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Types', () => {
    it('should create ValidationError', () => {
      const error = new ValidationError('Test validation error');
      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Test validation error');
    });

    it('should create UploadError', () => {
      const error = new UploadError('Test upload error');
      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe('UPLOAD_ERROR');
    });

    it('should create NetworkError', () => {
      const error = new NetworkError('Test network error');
      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should create QuotaError', () => {
      const error = new QuotaError('Test quota error');
      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe('QUOTA_ERROR');
    });

    it('should create PermissionError', () => {
      const error = new PermissionError('Test permission error');
      expect(error).toBeInstanceOf(StorageError);
      expect(error.code).toBe('PERMISSION_ERROR');
    });
  });

  describe('Image Compression', () => {
    it('should compress image successfully', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Mock canvas
      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      const result = await compressImage(file);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should respect max width and height', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await compressImage(file, 0.8, 1000, 1000);

      expect(mockCanvas.width).toBeLessThanOrEqual(1000);
      expect(mockCanvas.height).toBeLessThanOrEqual(1000);
    });

    it('should use custom quality setting', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 100,
        height: 100,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback, type, quality) => {
          expect(quality).toBe(0.6);
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await compressImage(file, 0.6);
    });

    it('should handle compression errors', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => null),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await expect(compressImage(file)).rejects.toThrow(
        'Failed to get canvas context'
      );
    });
  });

  describe('Thumbnail Generation', () => {
    it('should generate thumbnail with default size', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['thumbnail']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      const result = await generateThumbnail(file);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should generate thumbnail with custom size', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['thumbnail']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await generateThumbnail(file, 300);

      expect(mockCanvas.width).toBeLessThanOrEqual(300);
      expect(mockCanvas.height).toBeLessThanOrEqual(300);
    });
  });

  describe('Image Upload', () => {
    it('should reject invalid image format', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      await expect(
        uploadImage(file, { bucket: 'test-bucket' })
      ).rejects.toThrow(ValidationError);
    });

    it('should reject file larger than 5MB', async () => {
      const largeFile = new File(
        [new ArrayBuffer(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      await expect(
        uploadImage(largeFile, { bucket: 'test-bucket' })
      ).rejects.toThrow(ValidationError);
    });

    it('should accept valid JPG file', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.jpg');
      expect(result.contentType).toBe('image/jpeg');
      expect(result.compressionRatio).toBeDefined();
    });

    it('should accept valid PNG file', async () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.png' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.png' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.png');
      expect(result.contentType).toBe('image/png');
    });

    it('should accept valid WebP file', async () => {
      const file = new File(['content'], 'test.webp', { type: 'image/webp' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.webp' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.webp');
      expect(result.contentType).toBe('image/webp');
    });

    it('should accept valid SVG file', async () => {
      const file = new File(['content'], 'test.svg', { type: 'image/svg+xml' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.svg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.svg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.svg');
      expect(result.contentType).toBe('image/svg+xml');
    });

    it('should include folder in path', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'folder/test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/folder/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      await uploadImage(file, {
        bucket: 'test-bucket',
        folder: 'folder',
      });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('folder/'),
        expect.any(File),
        expect.any(Object)
      );
    });

    it('should throw QuotaError when quota exceeded', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Storage quota exceeded' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
          })),
        },
      } as any);

      await expect(
        uploadImage(file, { bucket: 'test-bucket' })
      ).rejects.toThrow(QuotaError);
    });

    it('should throw PermissionError when permission denied', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'permission denied' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
          })),
        },
      } as any);

      await expect(
        uploadImage(file, { bucket: 'test-bucket' })
      ).rejects.toThrow(PermissionError);
    });
  });

  describe('PDF Upload', () => {
    it('should reject non-PDF file', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      await expect(
        uploadPDF(file, { bucket: 'test-bucket' })
      ).rejects.toThrow(ValidationError);
    });

    it('should reject PDF larger than 10MB', async () => {
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        'large.pdf',
        { type: 'application/pdf' }
      );

      await expect(
        uploadPDF(largeFile, { bucket: 'test-bucket' })
      ).rejects.toThrow(ValidationError);
    });

    it('should accept valid PDF file', async () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.pdf' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.pdf' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadPDF(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.pdf');
      expect(result.contentType).toBe('application/pdf');
    });
  });

  describe('Batch Upload', () => {
    it('should upload multiple files successfully', async () => {
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.png', { type: 'image/png' }),
      ];

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await batchUpload(files, { bucket: 'test-bucket' });

      expect(result.successful.length).toBe(2);
      expect(result.failed.length).toBe(0);
    });

    it('should handle partial failures in batch upload', async () => {
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.txt', { type: 'text/plain' }), // Invalid
      ];

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await batchUpload(files, { bucket: 'test-bucket' });

      expect(result.successful.length).toBe(1);
      expect(result.failed.length).toBe(1);
    });

    it('should call progress callback during batch upload', async () => {
      const files = [
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.png', { type: 'image/png' }),
      ];

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const onProgress = jest.fn();

      await batchUpload(files, {
        bucket: 'test-bucket',
        onProgress,
      });

      expect(onProgress).toHaveBeenCalled();
      expect(onProgress).toHaveBeenCalledWith(50); // 50% after first file
      expect(onProgress).toHaveBeenCalledWith(100); // 100% after second file
    });
  });

  describe('File Deletion', () => {
    it('should delete file successfully', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await deleteFile('test-bucket', 'test.jpg');

      expect(mockRemove).toHaveBeenCalledWith(['test.jpg']);
    });

    it('should delete multiple files successfully', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await deleteFiles('test-bucket', ['test1.jpg', 'test2.jpg']);

      expect(mockRemove).toHaveBeenCalledWith(['test1.jpg', 'test2.jpg']);
    });

    it('should handle deletion errors', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'File not found' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await expect(
        deleteFile('test-bucket', 'test.jpg')
      ).rejects.toThrow(UploadError);
    });

    it('should throw PermissionError on permission denied', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'permission denied' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await expect(
        deleteFile('test-bucket', 'test.jpg')
      ).rejects.toThrow(PermissionError);
    });
  });

  describe('URL Utilities', () => {
    it('should get public URL', () => {
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const url = getPublicUrl('test-bucket', 'test.jpg');

      expect(url).toBe('https://example.com/test.jpg');
    });

    it('should extract path from URL', () => {
      const url = 'https://example.com/storage/v1/object/public/bucket/folder/file.jpg';
      const path = extractPathFromUrl(url);

      expect(path).toBe('folder/file.jpg');
    });

    it('should handle invalid URL in extractPathFromUrl', () => {
      const url = 'not-a-url';
      const path = extractPathFromUrl(url);

      expect(path).toBe('not-a-url');
    });
  });
});

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  })),
}));

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Image Compression', () => {
    it('should compress image successfully', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Mock canvas
      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      const result = await compressImage(file);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should respect max width and height', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await compressImage(file, 0.8, 1000, 1000);

      expect(mockCanvas.width).toBeLessThanOrEqual(1000);
      expect(mockCanvas.height).toBeLessThanOrEqual(1000);
    });

    it('should use custom quality setting', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 100,
        height: 100,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback, type, quality) => {
          expect(quality).toBe(0.6);
          callback(new Blob(['compressed']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await compressImage(file, 0.6);
    });

    it('should handle compression errors', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => null),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await expect(compressImage(file)).rejects.toThrow(
        'Failed to get canvas context'
      );
    });
  });

  describe('Thumbnail Generation', () => {
    it('should generate thumbnail with default size', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['thumbnail']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      const result = await generateThumbnail(file);

      expect(result).toBeInstanceOf(Blob);
    });

    it('should generate thumbnail with custom size', async () => {
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(new Blob(['thumbnail']));
        }),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      await generateThumbnail(file, 300);

      expect(mockCanvas.width).toBeLessThanOrEqual(300);
      expect(mockCanvas.height).toBeLessThanOrEqual(300);
    });
  });

  describe('Image Upload', () => {
    it('should reject invalid image format', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      await expect(
        uploadImage(file, { bucket: 'test-bucket' })
      ).rejects.toThrow('Invalid image format');
    });

    it('should reject file larger than 5MB', async () => {
      const largeFile = new File(
        [new ArrayBuffer(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      await expect(
        uploadImage(largeFile, { bucket: 'test-bucket' })
      ).rejects.toThrow('must be under 5MB');
    });

    it('should accept valid JPG file', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.jpg');
      expect(result.contentType).toBe('image/jpeg');
    });

    it('should accept valid PNG file', async () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.png' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.png' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.png');
      expect(result.contentType).toBe('image/png');
    });

    it('should accept valid WebP file', async () => {
      const file = new File(['content'], 'test.webp', { type: 'image/webp' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.webp' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.webp');
      expect(result.contentType).toBe('image/webp');
    });

    it('should accept valid SVG file', async () => {
      const file = new File(['content'], 'test.svg', { type: 'image/svg+xml' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.svg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.svg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadImage(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.svg');
      expect(result.contentType).toBe('image/svg+xml');
    });

    it('should include folder in path', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'folder/test.jpg' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/folder/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      await uploadImage(file, {
        bucket: 'test-bucket',
        folder: 'folder',
      });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('folder/'),
        expect.any(File),
        expect.any(Object)
      );
    });
  });

  describe('PDF Upload', () => {
    it('should reject non-PDF file', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      await expect(
        uploadPDF(file, { bucket: 'test-bucket' })
      ).rejects.toThrow('Only PDF files are allowed');
    });

    it('should reject PDF larger than 10MB', async () => {
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        'large.pdf',
        { type: 'application/pdf' }
      );

      await expect(
        uploadPDF(largeFile, { bucket: 'test-bucket' })
      ).rejects.toThrow('must be under 10MB');
    });

    it('should accept valid PDF file', async () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test.pdf' },
        error: null,
      });

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.pdf' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const result = await uploadPDF(file, { bucket: 'test-bucket' });

      expect(result.url).toBe('https://example.com/test.pdf');
      expect(result.contentType).toBe('application/pdf');
    });
  });

  describe('File Deletion', () => {
    it('should delete file successfully', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await deleteFile('test-bucket', 'test.jpg');

      expect(mockRemove).toHaveBeenCalledWith(['test.jpg']);
    });

    it('should handle deletion errors', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'File not found' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            remove: mockRemove,
          })),
        },
      } as any);

      await expect(
        deleteFile('test-bucket', 'test.jpg')
      ).rejects.toThrow('Delete failed');
    });
  });

  describe('URL Utilities', () => {
    it('should get public URL', () => {
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      });

      jest.spyOn(supabaseModule, 'createClient').mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            getPublicUrl: mockGetPublicUrl,
          })),
        },
      } as any);

      const url = getPublicUrl('test-bucket', 'test.jpg');

      expect(url).toBe('https://example.com/test.jpg');
    });

    it('should extract path from URL', () => {
      const url = 'https://example.com/storage/v1/object/public/bucket/folder/file.jpg';
      const path = extractPathFromUrl(url);

      expect(path).toBe('folder/file.jpg');
    });

    it('should handle invalid URL in extractPathFromUrl', () => {
      const url = 'not-a-url';
      const path = extractPathFromUrl(url);

      expect(path).toBe('not-a-url');
    });
  });
});
