# Supabase Storage Integration Guide

## Overview

This guide covers the Supabase Storage integration for the portfolio application. The system provides comprehensive utilities for uploading, managing, and serving images and PDF files with advanced features like compression, thumbnail generation, batch uploads, and retry logic.

## Features

### 1. Image Upload
- **Supported Formats**: JPEG, PNG, WebP, SVG
- **Max Size**: 5MB
- **Automatic Compression**: Reduces file size by 30-50% while maintaining quality
- **Thumbnail Generation**: Creates preview thumbnails for display
- **Progress Tracking**: Real-time upload progress callbacks

### 2. PDF Upload
- **Supported Format**: PDF only
- **Max Size**: 10MB
- **Validation**: Ensures valid PDF format before upload
- **Progress Tracking**: Real-time upload progress callbacks

### 3. Batch Upload
- **Multiple Files**: Upload up to 20 files in a single request
- **Mixed Types**: Support for both images and PDFs
- **Partial Success**: Returns successful and failed uploads separately
- **Progress Tracking**: Overall batch progress callback

### 4. Error Handling
- **Validation Errors**: Invalid format, size, or file type
- **Upload Errors**: Server-side upload failures
- **Network Errors**: Connection issues with retry logic
- **Quota Errors**: Storage quota exceeded
- **Permission Errors**: Access denied to storage bucket

### 5. Retry Logic
- **Exponential Backoff**: Automatic retry with increasing delays
- **Configurable Retries**: Default 3 retries, customizable
- **Smart Retry**: Skips validation errors, retries network issues

### 6. File Management
- **Delete Single**: Remove individual files
- **Delete Multiple**: Batch file deletion
- **List Files**: Browse files in storage buckets
- **Copy/Move**: Duplicate or relocate files within storage
- **Metadata**: Retrieve file information

## API Endpoints

### POST /api/upload/image
Upload a single image file.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@image.jpg" \
  -F "folder=projects" \
  -F "compress=true" \
  -F "quality=0.8"
```

**Parameters:**
- `file` (required): Image file (JPG, PNG, WebP, SVG)
- `folder` (optional): Destination folder in bucket
- `compress` (optional): Enable compression (default: true)
- `quality` (optional): Compression quality 0-1 (default: 0.8)

**Response (201 Created):**
```json
{
  "url": "https://cdn.example.com/projects/1234567890-abc123.jpg",
  "filename": "1234567890-abc123.jpg",
  "path": "projects/1234567890-abc123.jpg",
  "size": 245000,
  "contentType": "image/jpeg",
  "originalSize": 500000,
  "compressionRatio": 0.49
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file format or size
- `500 Internal Server Error`: Upload failed
- `507 Insufficient Storage`: Quota exceeded

### POST /api/upload/pdf
Upload a single PDF file.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload/pdf \
  -F "file=@certificate.pdf" \
  -F "folder=certificates"
```

**Parameters:**
- `file` (required): PDF file
- `folder` (optional): Destination folder in bucket

**Response (201 Created):**
```json
{
  "url": "https://cdn.example.com/certificates/1234567890-abc123.pdf",
  "filename": "1234567890-abc123.pdf",
  "path": "certificates/1234567890-abc123.pdf",
  "size": 1024000,
  "contentType": "application/pdf"
}
```

### POST /api/upload/batch
Upload multiple files in a batch.

**Request:**
```bash
curl -X POST http://localhost:3000/api/upload/batch \
  -F "files=@image1.jpg" \
  -F "files=@image2.png" \
  -F "files=@certificate.pdf" \
  -F "folder=portfolio" \
  -F "compress=true"
```

**Parameters:**
- `files` (required): Multiple files (up to 20)
- `folder` (optional): Destination folder
- `compress` (optional): Enable compression for images
- `quality` (optional): Compression quality

**Response (201 Created or 207 Multi-Status):**
```json
{
  "successful": [
    {
      "url": "https://cdn.example.com/portfolio/1234567890-abc123.jpg",
      "filename": "1234567890-abc123.jpg",
      "path": "portfolio/1234567890-abc123.jpg",
      "size": 245000,
      "contentType": "image/jpeg"
    }
  ],
  "failed": [
    {
      "filename": "invalid.txt",
      "error": "Invalid image format. Only JPG, PNG, WebP, and SVG are allowed."
    }
  ],
  "summary": {
    "total": 3,
    "successful": 2,
    "failed": 1
  }
}
```

### DELETE /api/upload/delete
Delete one or more files.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/upload/delete \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "portfolio-images",
    "path": "projects/1234567890-abc123.jpg"
  }'
```

**Parameters:**
- `bucket` (required): Storage bucket name
- `path` (optional): Single file path
- `paths` (optional): Array of file paths

**Response (200 OK):**
```json
{
  "message": "File(s) deleted successfully"
}
```

## Client-Side Usage

### Basic Image Upload

```typescript
import { uploadImage } from '@/lib/storage';

async function handleImageUpload(file: File) {
  try {
    const result = await uploadImage(file, {
      bucket: 'portfolio-images',
      folder: 'projects',
      compress: true,
      quality: 0.8,
    });

    console.log('Upload successful:', result.url);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Image Upload with Progress Tracking

```typescript
import { uploadImage } from '@/lib/storage';

async function handleImageUploadWithProgress(file: File) {
  try {
    const result = await uploadImage(file, {
      bucket: 'portfolio-images',
      folder: 'projects',
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`);
        // Update UI progress bar
      },
    });

    return result;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Batch Upload

```typescript
import { batchUpload } from '@/lib/storage';

async function handleBatchUpload(files: File[]) {
  try {
    const result = await batchUpload(files, {
      bucket: 'portfolio-images',
      folder: 'portfolio',
      onProgress: (progress) => {
        console.log(`Batch progress: ${progress}%`);
      },
    });

    console.log(`Successful: ${result.successful.length}`);
    console.log(`Failed: ${result.failed.length}`);

    return result;
  } catch (error) {
    console.error('Batch upload failed:', error);
  }
}
```

### Error Handling

```typescript
import {
  uploadImage,
  ValidationError,
  UploadError,
  QuotaError,
  PermissionError,
  NetworkError,
} from '@/lib/storage';

async function handleUploadWithErrorHandling(file: File) {
  try {
    const result = await uploadImage(file, {
      bucket: 'portfolio-images',
      maxRetries: 3,
      retryDelay: 1000,
    });

    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation error:', error.message);
      // Show user-friendly validation error
    } else if (error instanceof QuotaError) {
      console.error('Storage quota exceeded');
      // Show quota exceeded message
    } else if (error instanceof PermissionError) {
      console.error('Permission denied');
      // Show permission error
    } else if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
      // Show network error with retry option
    } else if (error instanceof UploadError) {
      console.error('Upload error:', error.message);
      // Show generic upload error
    }
  }
}
```

### File Deletion

```typescript
import { deleteFile, deleteFiles } from '@/lib/storage';

// Delete single file
async function deleteImage(path: string) {
  try {
    await deleteFile('portfolio-images', path);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}

// Delete multiple files
async function deleteMultipleImages(paths: string[]) {
  try {
    await deleteFiles('portfolio-images', paths);
    console.log('Files deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
```

### URL Utilities

```typescript
import { getPublicUrl, extractPathFromUrl } from '@/lib/storage';

// Get public URL
const url = getPublicUrl('portfolio-images', 'projects/image.jpg');
console.log(url); // https://cdn.example.com/projects/image.jpg

// Extract path from URL
const path = extractPathFromUrl('https://cdn.example.com/projects/image.jpg');
console.log(path); // projects/image.jpg
```

## React Component Example

```typescript
'use client';

import { useState } from 'react';
import { uploadImage, ValidationError, StorageError } from '@/lib/storage';

export function ImageUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadImage(file, {
        bucket: 'portfolio-images',
        folder: 'projects',
        compress: true,
        quality: 0.8,
        onProgress: setProgress,
      });

      setImageUrl(result.url);
      console.log('Compression ratio:', result.compressionRatio);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else if (err instanceof StorageError) {
        setError(`Upload failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <p>{progress}%</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageUrl && (
        <div>
          <p>Upload successful!</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
}
```

## Configuration

### Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Storage Buckets

Create two public buckets in Supabase:

1. **portfolio-images**
   - For images (JPG, PNG, WebP, SVG)
   - Max file size: 5MB
   - Public access enabled

2. **portfolio-pdfs**
   - For PDF files
   - Max file size: 10MB
   - Public access enabled

### CORS Configuration

Configure CORS in Supabase Storage settings:

```json
{
  "allowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["*"],
  "maxAgeSeconds": 3600
}
```

## Performance Optimization

### Image Compression

The system automatically compresses images to reduce file size:

- **Default Quality**: 0.8 (80%)
- **Typical Reduction**: 30-50% file size reduction
- **Supported Formats**: JPEG, PNG, WebP
- **SVG**: Not compressed (vector format)

### Thumbnail Generation

Generate thumbnails for preview display:

```typescript
import { generateThumbnail } from '@/lib/storage';

const thumbnailBlob = await generateThumbnail(file, 200); // 200x200px
```

### CDN Caching

All uploaded files are cached with:
- **Cache Control**: 3600 seconds (1 hour)
- **CDN**: Vercel Edge Network (if using Vercel)
- **Automatic Invalidation**: On file update/delete

## Retry Logic

The system implements exponential backoff for failed uploads:

```
Attempt 1: Immediate
Attempt 2: Wait 1 second
Attempt 3: Wait 2 seconds
Attempt 4: Wait 4 seconds
```

**Configuration:**
```typescript
await uploadImage(file, {
  bucket: 'portfolio-images',
  maxRetries: 3,      // Default: 3
  retryDelay: 1000,   // Default: 1000ms
});
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|------------|
| VALIDATION_ERROR | Invalid file format, size, or type | 400 |
| UPLOAD_ERROR | Server-side upload failure | 500 |
| NETWORK_ERROR | Connection issue | 500 |
| QUOTA_ERROR | Storage quota exceeded | 507 |
| PERMISSION_ERROR | Access denied | 403 |

## Testing

Run the storage tests:

```bash
npm run test -- src/lib/storage.test.ts
```

Test coverage includes:
- Image compression and thumbnails
- File upload and validation
- Batch upload with progress
- Error handling and retry logic
- File deletion
- URL utilities

## Best Practices

1. **Always Validate**: Check file format and size before upload
2. **Use Compression**: Enable compression for images to save bandwidth
3. **Handle Errors**: Implement proper error handling for user feedback
4. **Progress Tracking**: Show upload progress for better UX
5. **Batch Operations**: Use batch upload for multiple files
6. **Cleanup**: Delete unused files to manage storage quota
7. **Organize**: Use folders to organize files by type/category
8. **Monitor**: Track upload metrics and errors for debugging

## Troubleshooting

### Upload Fails with "Invalid Format"
- Ensure file is in supported format (JPG, PNG, WebP, SVG for images)
- Check file MIME type is correct

### Upload Fails with "File Too Large"
- Images: Max 5MB
- PDFs: Max 10MB
- Compress images before upload

### Upload Fails with "Quota Exceeded"
- Check Supabase storage quota
- Delete unused files
- Upgrade storage plan if needed

### Upload Fails with "Permission Denied"
- Verify bucket is public
- Check CORS configuration
- Verify Supabase credentials

### Slow Uploads
- Check network connection
- Enable image compression
- Use batch upload for multiple files
- Check Supabase region latency

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Image Compression Best Practices](https://web.dev/image-optimization/)
- [CDN Caching Strategies](https://web.dev/http-cache/)
