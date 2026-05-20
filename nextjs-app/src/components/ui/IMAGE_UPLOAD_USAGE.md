# ImageUpload Component Usage Guide

## Overview

The `ImageUpload` component is a reusable, fully-featured image upload component with:
- File format validation (JPG, PNG, WebP, SVG)
- File size validation (max 5MB)
- Image preview
- Drag-and-drop support
- Upload progress tracking
- Image compression before upload
- Thumbnail generation
- Supabase Storage integration
- Dark mode support
- Full TypeScript support

## Basic Usage

```tsx
import { ImageUpload } from '@/components/ui';

export function MyComponent() {
  const handleUpload = (result) => {
    console.log('Image uploaded:', result.url);
  };

  return (
    <ImageUpload
      bucket="portfolio-images"
      folder="projects"
      onUpload={handleUpload}
    />
  );
}
```

## Props

### Required Props

- **`bucket`** (string): Supabase Storage bucket name where images will be uploaded
- **`onUpload`** (function): Callback function called when image is successfully uploaded
  - Receives: `UploadResult` object with `url`, `filename`, `path`, `size`, `contentType`

### Optional Props

- **`folder`** (string): Folder path within the bucket (e.g., "projects", "avatars")
- **`onError`** (function): Callback function called when upload fails
  - Receives: `Error` object
- **`onProgress`** (function): Callback function for upload progress (0-100)
  - Receives: `number` (progress percentage)
- **`preview`** (string): Initial preview image URL (for editing existing images)
- **`label`** (string): Custom label for the upload area (default: "Upload Image")
- **`helpText`** (string): Custom help text (default: "JPG, PNG, WebP, or SVG (max 5MB)")
- **`compress`** (boolean): Whether to compress image before upload (default: true)
- **`quality`** (number): Compression quality 0-1 (default: 0.8)
- **`generateThumbnail`** (boolean): Whether to generate thumbnail (default: false)
- **`disabled`** (boolean): Disable the upload component (default: false)
- **`className`** (string): Additional CSS classes

## Advanced Usage

### With Progress Tracking

```tsx
import { useState } from 'react';
import { ImageUpload } from '@/components/ui';

export function ImageUploadWithProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <ImageUpload
        bucket="portfolio-images"
        folder="projects"
        onUpload={(result) => {
          console.log('Uploaded:', result.url);
        }}
        onProgress={(p) => setProgress(p)}
        onError={(error) => {
          console.error('Upload failed:', error.message);
        }}
      />
      {progress > 0 && progress < 100 && (
        <p>Upload progress: {progress}%</p>
      )}
    </div>
  );
}
```

### With Custom Compression

```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="projects"
  onUpload={handleUpload}
  compress={true}
  quality={0.6}  // Lower quality for smaller file size
/>
```

### With Thumbnail Generation

```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="projects"
  onUpload={handleUpload}
  generateThumbnail={true}
/>
```

### With Initial Preview (Editing)

```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="projects"
  onUpload={handleUpload}
  preview="https://example.com/current-image.jpg"
  label="Update Project Image"
/>
```

### Disabled State

```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="projects"
  onUpload={handleUpload}
  disabled={isLoading}
/>
```

## Upload Result

When an image is successfully uploaded, the `onUpload` callback receives an `UploadResult` object:

```typescript
interface UploadResult {
  url: string;           // Public URL of the uploaded image
  filename: string;      // Generated filename (e.g., "1234567890-abc123.jpg")
  path: string;          // Full path in bucket (e.g., "projects/1234567890-abc123.jpg")
  size: number;          // File size in bytes
  contentType: string;   // MIME type (e.g., "image/jpeg")
}
```

## Supported Formats

- **JPG/JPEG** (image/jpeg)
- **PNG** (image/png)
- **WebP** (image/webp)
- **SVG** (image/svg+xml)

## Size Limits

- **Maximum file size**: 5MB
- **Images are automatically compressed** to reduce file size while maintaining quality

## Features

### File Validation

- Format validation (only JPG, PNG, WebP, SVG allowed)
- Size validation (max 5MB)
- User-friendly error messages

### Image Compression

- Automatic compression before upload (can be disabled)
- Configurable quality (0-1, default 0.8)
- Maintains aspect ratio
- Reduces file size for optimal performance

### Thumbnail Generation

- Optional thumbnail generation
- Default size: 200x200px
- Useful for preview images

### Drag and Drop

- Click to select files
- Drag and drop files onto the upload area
- Visual feedback during drag operations

### Upload Progress

- Real-time progress tracking (0-100%)
- Loading state display
- Progress callback for custom UI

### Preview

- Image preview after selection
- Initial preview support (for editing)
- Remove preview button

### Dark Mode

- Fully compatible with dark mode
- Uses CSS variables for theming
- Automatic theme detection

## Error Handling

The component handles various error scenarios:

```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="projects"
  onUpload={handleUpload}
  onError={(error) => {
    if (error.message.includes('Invalid image format')) {
      // Handle format error
    } else if (error.message.includes('must be under 5MB')) {
      // Handle size error
    } else {
      // Handle upload error
    }
  }}
/>
```

## Integration with Forms

```tsx
import { useState } from 'react';
import { ImageUpload } from '@/components/ui';

export function ProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });

  const handleImageUpload = (result) => {
    setFormData({
      ...formData,
      image: result.url,
    });
  };

  return (
    <form>
      <input
        type="text"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        placeholder="Project title"
      />

      <ImageUpload
        bucket="portfolio-images"
        folder="projects"
        onUpload={handleImageUpload}
        preview={formData.image}
      />

      <button type="submit">Save Project</button>
    </form>
  );
}
```

## Styling

The component uses Tailwind CSS and CSS variables for styling. To customize colors, update your CSS variables:

```css
:root {
  --foreground: #000;
  --background: #fff;
  --card: #f5f5f5;
  --border: #e0e0e0;
  --muted: #999;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground: #fff;
    --background: #000;
    --card: #1a1a1a;
    --border: #333;
    --muted: #666;
  }
}
```

## Storage Utilities

The component uses storage utilities from `@/lib/storage`:

- **`uploadImage()`**: Upload image to Supabase Storage
- **`uploadPDF()`**: Upload PDF to Supabase Storage
- **`compressImage()`**: Compress image using Canvas API
- **`generateThumbnail()`**: Generate thumbnail from image
- **`deleteFile()`**: Delete file from Supabase Storage
- **`getPublicUrl()`**: Get public URL for a file
- **`extractPathFromUrl()`**: Extract path from public URL

## Performance Considerations

- Images are compressed before upload to reduce bandwidth
- Compression is done client-side (no server overhead)
- Progress tracking provides real-time feedback
- Lazy loading of images in preview
- CDN caching via Supabase Storage

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Touch-friendly buttons

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Image not uploading

1. Check Supabase Storage bucket exists
2. Verify bucket name is correct
3. Check RLS policies allow uploads
4. Verify file format is supported
5. Check file size is under 5MB

### Compression not working

1. Ensure browser supports Canvas API
2. Check image format (SVG cannot be compressed)
3. Verify quality setting is between 0-1

### Preview not showing

1. Check image URL is accessible
2. Verify CORS settings in Supabase
3. Check image format is supported

## Examples

See `ImageUpload.test.tsx` for comprehensive test examples covering all features.
