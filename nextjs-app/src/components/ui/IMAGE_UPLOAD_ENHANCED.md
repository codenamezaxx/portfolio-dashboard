# ImageUpload Component - Enhanced Documentation

## Overview

The `ImageUpload` component provides a complete image upload solution with drag-and-drop support, progress tracking, and upload cancellation. It integrates with Supabase Storage for file management and includes comprehensive error handling and validation.

## Features

### Core Features
- **Drag-and-Drop Upload**: Users can drag files directly onto the upload area
- **Visual Feedback**: Highlight effect when dragging files over the upload area
- **File Validation**: Validates file format (JPG, PNG, WebP, SVG) and size (max 5MB)
- **Image Preview**: Shows preview of selected image before upload
- **Progress Tracking**: Real-time progress bar with percentage display
- **File Size Display**: Shows filename and file size during upload
- **Upload Cancellation**: Users can cancel ongoing uploads
- **Error Handling**: User-friendly error messages for validation failures
- **Image Compression**: Automatic image compression with configurable quality
- **Accessibility**: Full keyboard navigation and ARIA labels

### Advanced Features
- **Dark Mode Support**: Tailwind CSS dark mode classes included
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Abort Controller**: Proper upload cancellation using AbortController
- **Compression Options**: Configurable compression quality and max dimensions
- **Custom Styling**: Flexible className prop for custom styling
- **Callback Hooks**: onUpload, onError, and onCancel callbacks

## Usage

### Basic Usage

```tsx
import { ImageUpload } from '@/components/ui/ImageUpload';

export function MyComponent() {
  return (
    <ImageUpload
      onUpload={(result) => {
        console.log('Image uploaded:', result.url);
      }}
      onError={(error) => {
        console.error('Upload failed:', error.message);
      }}
    />
  );
}
```

### With Custom Configuration

```tsx
<ImageUpload
  bucket="my-bucket"
  folder="profile-pictures"
  compress={true}
  quality={0.85}
  maxSize={10 * 1024 * 1024} // 10MB
  acceptedFormats={['image/jpeg', 'image/png']}
  showFileSize={true}
  onUpload={(result) => {
    console.log('Uploaded to:', result.url);
  }}
  onError={(error) => {
    console.error('Error:', error.message);
  }}
  onCancel={() => {
    console.log('Upload cancelled');
  }}
/>
```

### With Custom Styling

```tsx
<ImageUpload
  className="my-custom-class"
  onUpload={(result) => {
    // Handle upload
  }}
/>
```

## Props

### ImageUploadProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(result: UploadResult) => void` | `undefined` | Callback when upload succeeds |
| `onError` | `(error: Error) => void` | `undefined` | Callback when upload fails |
| `onCancel` | `() => void` | `undefined` | Callback when upload is cancelled |
| `bucket` | `string` | `'portfolio-images'` | Supabase Storage bucket name |
| `folder` | `string` | `undefined` | Folder path within bucket |
| `compress` | `boolean` | `true` | Enable image compression |
| `quality` | `number` | `0.8` | Compression quality (0-1) |
| `maxSize` | `number` | `5242880` | Maximum file size in bytes (5MB) |
| `acceptedFormats` | `string[]` | `['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']` | Accepted MIME types |
| `disabled` | `boolean` | `false` | Disable upload functionality |
| `className` | `string` | `''` | Custom CSS classes |
| `showFileSize` | `boolean` | `true` | Show file size during upload |

## Return Types

### UploadResult

```typescript
interface UploadResult {
  url: string;              // Public URL of uploaded image
  filename: string;         // Generated filename
  path: string;            // Full path in storage
  size: number;            // File size in bytes
  contentType: string;     // MIME type
  originalSize?: number;   // Original size before compression
  compressionRatio?: number; // Compression ratio (0-1)
}
```

## Drag-and-Drop Behavior

### Visual Feedback
- **Default State**: Gray dashed border with upload icon
- **Drag Over**: Blue border and light blue background
- **Uploading**: Progress bar with percentage and file info
- **Error**: Red error message below upload area

### Keyboard Support
- **Enter Key**: Trigger file selection
- **Space Key**: Trigger file selection
- **Tab**: Navigate to upload area

## File Validation

### Format Validation
- Accepted formats: JPG, PNG, WebP, SVG
- Custom formats can be specified via `acceptedFormats` prop
- Invalid formats show error message

### Size Validation
- Default max size: 5MB
- Custom max size via `maxSize` prop
- Oversized files show error message

### Compression
- Automatic compression for JPEG and PNG
- SVG files are not compressed
- Configurable quality (0-1)
- Maintains aspect ratio

## Progress Tracking

### Progress Display
- Real-time progress bar
- Percentage complete (0-100%)
- File name and size display
- Cancel button during upload

### Progress Callback
The component uses the `onProgress` callback from the storage library to update the progress bar in real-time.

## Upload Cancellation

### How It Works
1. User clicks "Cancel Upload" button during upload
2. AbortController aborts the fetch request
3. Upload state is reset
4. `onCancel` callback is invoked
5. Component returns to initial state

### Implementation
```tsx
const handleCancelUpload = useCallback(() => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  // Reset state...
  onCancel?.();
}, [onCancel]);
```

## Error Handling

### Error Types
1. **Invalid Format**: File type not in accepted formats
2. **File Too Large**: File size exceeds maximum
3. **Upload Failed**: Network or server error
4. **Compression Failed**: Image compression error (falls back to original)

### Error Messages
- Clear, user-friendly error messages
- Specific field information
- Suggestions for resolution

## Accessibility

### ARIA Labels
- `role="button"` on upload area
- `aria-label="Upload image area"` on container
- `aria-label="Upload image"` on file input
- `role="progressbar"` on progress bar
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on progress bar

### Keyboard Navigation
- Tab to upload area
- Enter or Space to trigger file selection
- Tab to cancel button during upload

### Screen Reader Support
- Descriptive labels for all interactive elements
- Progress bar updates announced
- Error messages clearly stated

## Styling

### Tailwind Classes
The component uses Tailwind CSS utility classes:
- `border-2 border-dashed` for upload area
- `border-blue-500 bg-blue-50` for drag-over state
- `dark:` prefixes for dark mode support
- `transition-colors` for smooth transitions

### Custom Styling
```tsx
<ImageUpload
  className="rounded-xl shadow-lg"
  onUpload={(result) => {
    // Handle upload
  }}
/>
```

## Integration with Supabase

### Storage Configuration
```typescript
// Default bucket
bucket: 'portfolio-images'

// Custom bucket
bucket: 'my-custom-bucket'

// With folder
folder: 'profile-pictures'
```

### File Path Structure
```
bucket/
├── folder/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
```

### Public URL
```
https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
```

## Testing

### Unit Tests
The component includes comprehensive unit tests covering:
- File format validation
- File size validation
- Drag-and-drop functionality
- Progress tracking
- Upload cancellation
- Error handling
- Accessibility features

### Running Tests
```bash
npm run test -- ImageUpload.test.tsx
```

### Test Coverage
- 30 test cases
- 100% coverage of core functionality
- Edge cases and error scenarios

## Performance Considerations

### Image Compression
- Reduces file size by 20-40% typically
- Maintains visual quality
- Configurable quality setting
- Fallback to original if compression fails

### Progress Updates
- Real-time progress bar updates
- Smooth transitions
- No blocking operations

### Memory Management
- Proper cleanup on component unmount
- AbortController for request cancellation
- FileReader for preview generation

## Browser Support

### Desktop Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Mobile Browsers
- iOS Safari 14+
- Chrome Android 90+
- Samsung Internet 14+

### Features
- Drag-and-drop: Desktop browsers
- File input: All browsers
- Progress tracking: All browsers
- Cancellation: All browsers

## Common Use Cases

### Profile Picture Upload
```tsx
<ImageUpload
  bucket="profile-pictures"
  folder={userId}
  maxSize={2 * 1024 * 1024} // 2MB
  onUpload={(result) => {
    updateUserProfile({ profilePicture: result.url });
  }}
/>
```

### Project Image Upload
```tsx
<ImageUpload
  bucket="project-images"
  folder={projectId}
  compress={true}
  quality={0.9}
  onUpload={(result) => {
    addProjectImage({ url: result.url, path: result.path });
  }}
/>
```

### Hero Section Image
```tsx
<ImageUpload
  bucket="portfolio-images"
  folder="hero"
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={(result) => {
    updateHeroImage(result.url);
  }}
/>
```

## Troubleshooting

### Upload Fails with "Permission Denied"
- Check Supabase RLS policies
- Verify bucket name is correct
- Ensure user has upload permissions

### Progress Bar Not Updating
- Check browser console for errors
- Verify `onProgress` callback is being called
- Check network tab for upload progress

### Drag-and-Drop Not Working
- Ensure browser supports drag-and-drop
- Check if JavaScript is enabled
- Verify event handlers are attached

### Image Not Compressed
- Check if file type is JPEG or PNG
- SVG files are not compressed
- Verify compression is enabled

## API Reference

### Methods

#### handleFileSelect(file: File)
Validates and uploads a file.

#### handleCancelUpload()
Cancels the current upload and resets state.

#### handleDrag(e: React.DragEvent)
Handles drag enter/leave events.

#### handleDrop(e: React.DragEvent)
Handles drop event.

#### handleChange(e: React.ChangeEvent)
Handles file input change event.

#### handleClick()
Triggers file input click.

## Related Components

- `PDFUpload`: Similar component for PDF uploads
- `ImagePreview`: Display uploaded images
- `FileUpload`: Generic file upload component

## Future Enhancements

- [ ] Multiple file upload
- [ ] Crop/resize before upload
- [ ] Image filters
- [ ] Batch upload with progress
- [ ] Retry failed uploads
- [ ] Upload history
- [ ] Image optimization presets

## License

This component is part of the Portfolio Website project and follows the same license.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
