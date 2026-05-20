/**
 * PDFUpload Component
 * 
 * Features:
 * - Drag-and-drop file upload with visual feedback
 * - PDF preview before upload
 * - Progress tracking with percentage and file size display
 * - Upload cancellation support
 * - Error handling with user-friendly messages
 * - File size validation (max 5MB)
 * - PDF format validation
 * - Accessibility support
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { type UploadResult } from '@/lib/storage';
import { uploadPDFApi } from '@/lib/upload-utils';

export interface PDFUploadProps {
  onUpload?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  bucket?: string;
  folder?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  showFileSize?: boolean;
}

export function PDFUpload({
  onUpload,
  onError,
  onCancel,
  bucket = 'portfolio-pdfs',
  folder,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  className = '',
  showFileSize = true,
}: PDFUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setCurrentFile(file);

      // Validate file format
      if (file.type !== 'application/pdf') {
        const errorMessage = 'Invalid file format. Only PDF files are allowed.';
        setError(errorMessage);
        const error = new Error(errorMessage);
        onError?.(error);
        setCurrentFile(null);
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        const errorMessage = `File size exceeds maximum of ${(maxSize / 1024 / 1024).toFixed(2)}MB`;
        setError(errorMessage);
        const error = new Error(errorMessage);
        onError?.(error);
        setCurrentFile(null);
        return;
      }

      // Show preview
      setPreview({
        name: file.name,
        size: file.size,
      });

      // Upload file
      setUploading(true);
      setProgress(0);

      // Create abort controller for cancellation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const result = await uploadPDFApi(file, {
          folder,
          onProgress: setProgress,
          abortController,
        });

        onUpload?.(result);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        // Don't show error if upload was cancelled
        if (err instanceof Error && err.message !== 'Upload cancelled') {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error.message);
          onError?.(error);
        }
      } finally {
        setUploading(false);
        setProgress(0);
        setCurrentFile(null);
        abortControllerRef.current = null;
      }
    },
    [bucket, folder, maxSize, onUpload, onError]
  );

  const handleCancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploading(false);
    setProgress(0);
    setCurrentFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel?.();
  }, [onCancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        aria-label="Upload PDF area"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !uploading) {
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          disabled={disabled || uploading}
          className="hidden"
          aria-label="Upload PDF"
        />

        {preview && !uploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M8.5 3a1 1 0 00-1 1v12a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm-3 1a1 1 0 00-1 1v12a1 1 0 001 1h.5a1 1 0 001-1V5a1 1 0 00-1-1h-.5zm7 0a1 1 0 00-1 1v12a1 1 0 001 1h.5a1 1 0 001-1V5a1 1 0 00-1-1h-.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {preview.name}
              </p>
              {showFileSize && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {(preview.size / 1024 / 1024).toFixed(2)}MB
                </p>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Click to change PDF</p>
          </div>
        ) : uploading ? (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Uploading...
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Upload progress"
              />
            </div>

            {/* Progress Information */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progress)}% Complete
              </p>
              {showFileSize && currentFile && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentFile.name} • {(currentFile.size / 1024 / 1024).toFixed(2)}MB
                </p>
              )}
            </div>

            {/* Cancel Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelUpload();
              }}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              aria-label="Cancel upload"
            >
              Cancel Upload
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 20M24 16a4 4 0 110-8 4 4 0 010 8z"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Drag and drop your PDF here
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              or click to select a file
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PDF files only (Max {(maxSize / 1024 / 1024).toFixed(0)}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
