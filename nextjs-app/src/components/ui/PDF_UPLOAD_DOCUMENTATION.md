# PDF Upload System Documentation

## Overview

The PDF Upload System provides a complete solution for uploading, validating, and previewing PDF files in the portfolio application. It consists of three main components:

1. **PDFUpload** - Drag-and-drop upload component with validation and progress tracking
2. **PDFPreview** - PDF viewer with page navigation and download functionality
3. **Storage Integration** - Supabase Storage backend for PDF persistence

## Components

### PDFUpload Component

A React component that handles PDF file uploads with drag-and-drop support, validation, and progress tracking.

#### Features

- **Drag-and-Drop Upload**: Users can drag PDF files directly onto the component
- **File Validation**: Validates PDF format and file size (max 5MB by default)
- **Progress Tracking**: Shows upload progress with percentage and file size
- **Upload Cancellation**: Users can cancel uploads in progress
- **Error Handling**: User-friendly error messages for validation failures
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Dark Mode Support**: Tailwind CSS dark mode compatible

#### Props

```typescript
interface PDFUploadProps {
  onUpload?: (result: UploadResult) => void;      // Called when upload succeeds
  onError?: (error: Error) => void;               // Called when upload fails
  onCancel?: () => void;                          // Called when upload is cancelled
  bucket?: string;                                // Supabase bucket name (default: 'portfolio-pdfs')
  folder?: string;                                // Folder path in bucket (optional)
  maxSize?: number;                               // Max file size in bytes (default: 5MB)
  disabled?: boolean;                             // Disable upload (default: false)
  className?: string;                             // Additional CSS classes
  showFileSize?: boolean;                         // Show file size in progress (default: true)
}
```

#### Usage Example

```tsx
import { PDFUpload } from '@/components/ui/PDFUpload';

export function AchievementForm() {
  const handleUpload = (result) => {
    console.log('PDF uploaded:', result.url);
    // Save URL to database
  };

  const handleError = (error) => {
    console.error('Upload failed:', error.message);
    // Show error toast
  };

  return (
    <PDFUpload
      onUpload={handleUpload}
      onError={handleError}
      bucket="portfolio-pdfs"
      folder="achievements"
      maxSize={5 * 1024 * 1024}
    />
  );
}
```

#### Upload Result

```typescript
interface UploadResult {
  url: string;              // Public URL of uploaded PDF
  filename: string;         // Generated filename
  path: string;             // Path in storage bucket
  size: number;             // File size in bytes
  contentType: string;      // MIME type (application/pdf)
}
```

### PDFPreview Component

A React component that displays PDF files with page navigation and download functionality.

#### Features

- **PDF Rendering**: Renders PDF pages using PDF.js
- **Page Navigation**: Previous/Next buttons to navigate through pages
- **Page Information**: Displays current page and total page count
- **Download**: Download button to save PDF locally
- **Error Handling**: Graceful error display if PDF fails to load
- **Loading State**: Shows loading indicator while PDF is being loaded
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Full keyboard support and ARIA labels

#### Props

```typescript
interface PDFPreviewProps {
  url: string;                    // URL of PDF to display
  filename?: string;              // Filename for download (default: 'document.pdf')
  className?: string;             // Additional CSS classes
  maxHeight?: string;             // Max height of preview (default: '600px')
  showDownload?: boolean;         // Show download button (default: true)
  showPageInfo?: boolean;         // Show page information (default: true)
}
```

#### Usage Example

```tsx
import { PDFPreview } from '@/components/ui/PDFPreview';

export function CertificateViewer({ pdfUrl, filename }) {
  return (
    <PDFPreview
      url={pdfUrl}
      filename={filename}
      maxHeight="800px"
      showDownload={true}
      showPageInfo={true}
    />
  );
}
```

## File Validation

### PDF Format Validation

- Only `application/pdf` MIME type is accepted
- Files with other extensions or MIME types are rejected
- Error message: "Invalid file format. Only PDF files are allowed."

### File Size Validation

- Default maximum size: 5MB (5,242,880 bytes)
- Customizable via `maxSize` prop
- Error message: "File size exceeds maximum of X.XXMB"

### Validation Flow

```
User selects/drops file
    ↓
Check MIME type
    ↓ (invalid)
Show error, call onError
    ↓ (valid)
Check file size
    ↓ (too large)
Show error, call onError
    ↓ (valid)
Show preview
    ↓
Start upload
    ↓
Track progress
    ↓
Upload complete
    ↓
Call onUpload with result
```

## Storage Integration

### Supabase Storage Setup

1. **Create Storage Bucket**
   ```sql
   -- Create bucket for PDFs
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('portfolio-pdfs', 'portfolio-pdfs', true);
   ```

2. **Set RLS Policies**
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'portfolio-pdfs');

   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated upload" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'portfolio-pdfs' AND
     auth.role() = 'authenticated'
   );
   ```

3. **Configure CORS** (if needed)
   - Allow requests from your domain
   - Enable credentials if using authentication

### Upload Process

```
PDFUpload component
    ↓
Validate file
    ↓
Call uploadPDF() from storage.ts
    ↓
Generate unique filename
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Return UploadResult
    ↓
Call onUpload callback
```

### File Naming

Files are stored with unique names to prevent collisions:

```
Format: {timestamp}-{random}.pdf
Example: 1704067200000-a1b2c3.pdf
```

- **Timestamp**: Current Unix timestamp in milliseconds
- **Random**: 6-character random string
- **Extension**: .pdf

## Error Handling

### Validation Errors

| Error | Cause | Message |
|-------|-------|---------|
| Invalid Format | Non-PDF file | "Invalid file format. Only PDF files are allowed." |
| File Too Large | Size > maxSize | "File size exceeds maximum of X.XXMB" |

### Upload Errors

| Error | Cause | Message |
|-------|-------|---------|
| Network Error | Connection failed | "Network error during upload: ..." |
| Permission Error | No upload permission | "Permission denied: ..." |
| Quota Error | Storage quota exceeded | "Storage quota exceeded: ..." |
| Upload Error | General upload failure | "Upload failed: ..." |

### Error Handling Example

```tsx
const handleError = (error: Error) => {
  if (error.message.includes('Invalid file format')) {
    // Show format error
  } else if (error.message.includes('exceeds maximum')) {
    // Show size error
  } else if (error.message.includes('Network error')) {
    // Show network error with retry option
  } else {
    // Show generic error
  }
};
```

## Progress Tracking

### Progress Events

The `onProgress` callback is called during upload with a percentage (0-100):

```tsx
const handleProgress = (progress: number) => {
  console.log(`Upload progress: ${progress}%`);
  // Update progress bar
};
```

### Progress Display

The component automatically displays:
- Progress bar (visual indicator)
- Percentage complete (text)
- File name and size (if showFileSize is true)
- Cancel button

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate to upload area
- **Enter/Space**: Trigger file selection
- **Tab**: Navigate to buttons (Previous, Next, Download, Cancel)
- **Enter**: Activate buttons

### ARIA Labels

- Upload area: `aria-label="Upload PDF area"`
- File input: `aria-label="Upload PDF"`
- Progress bar: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Navigation buttons: `aria-label="Previous page"`, `aria-label="Next page"`
- Download button: `aria-label="Download {filename}"`

### Screen Reader Support

- All interactive elements have descriptive labels
- Error messages are announced
- Progress updates are announced
- Page information is announced

## Testing

### Unit Tests

Tests are provided in `PDFUpload.test.tsx` and `PDFPreview.test.tsx`:

```bash
npm run test -- PDFUpload.test.tsx
npm run test -- PDFPreview.test.tsx
```

### Test Coverage

- File format validation
- File size validation
- Drag-and-drop functionality
- Progress tracking
- Upload cancellation
- Error handling
- Callback invocations
- Accessibility features
- Keyboard navigation

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Integration Examples

### In Achievement Form

```tsx
import { PDFUpload } from '@/components/ui/PDFUpload';
import { PDFPreview } from '@/components/ui/PDFPreview';

export function AchievementForm() {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Certificate PDF
        </label>
        <PDFUpload
          onUpload={(result) => setPdfUrl(result.url)}
          onError={(error) => console.error(error)}
          bucket="portfolio-pdfs"
          folder="achievements"
        />
      </div>

      {pdfUrl && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Preview
          </label>
          <PDFPreview
            url={pdfUrl}
            filename="certificate.pdf"
            maxHeight="600px"
          />
        </div>
      )}
    </div>
  );
}
```

### In Admin Dashboard

```tsx
import { PDFUpload } from '@/components/ui/PDFUpload';

export function AchievementManager() {
  const handleUpload = async (result: UploadResult) => {
    // Save to database
    await updateAchievement({
      pdfUrl: result.url,
      pdfPath: result.path,
      pdfSize: result.size,
    });

    // Show success message
    toast.success('Certificate uploaded successfully');
  };

  return (
    <form className="space-y-6">
      {/* Other form fields */}

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Certificate
        </label>
        <PDFUpload
          onUpload={handleUpload}
          onError={(error) => toast.error(error.message)}
          bucket="portfolio-pdfs"
          folder="achievements"
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </div>

      <button type="submit">Save Achievement</button>
    </form>
  );
}
```

## Performance Considerations

### File Size Limits

- Default: 5MB
- Recommended: 2-5MB for optimal performance
- Maximum: 10MB (Supabase default)

### Upload Speed

- Depends on file size and network speed
- Typical upload time: 1-5 seconds for 5MB file
- Progress tracking updates every 100ms

### Storage Optimization

- PDFs are stored as-is (no compression)
- Use PDF compression tools before upload if needed
- Consider file size limits in your storage plan

## Troubleshooting

### PDF Won't Upload

1. Check file format (must be PDF)
2. Check file size (must be ≤ 5MB)
3. Check network connection
4. Check Supabase credentials
5. Check storage bucket permissions

### PDF Preview Not Loading

1. Check PDF URL is accessible
2. Check CORS settings in Supabase
3. Check PDF.js worker is loaded
4. Check browser console for errors

### Progress Not Updating

1. Check `onProgress` callback is provided
2. Check network connection
3. Check file size (very small files may complete too quickly)

### Upload Cancelled

1. User clicked cancel button
2. Network connection lost
3. Browser tab closed

## Best Practices

1. **Validate on Client and Server**
   - Client-side validation for UX
   - Server-side validation for security

2. **Handle Errors Gracefully**
   - Show user-friendly error messages
   - Provide retry options for network errors

3. **Optimize File Size**
   - Compress PDFs before upload
   - Set appropriate maxSize limits

4. **Secure Storage**
   - Use RLS policies to control access
   - Store sensitive PDFs in private buckets

5. **Monitor Performance**
   - Track upload times
   - Monitor storage usage
   - Set up alerts for quota limits

6. **Accessibility**
   - Test with screen readers
   - Ensure keyboard navigation works
   - Provide alt text for images

## API Reference

### uploadPDF Function

```typescript
export async function uploadPDF(
  file: File,
  options: UploadOptions
): Promise<UploadResult>
```

**Parameters:**
- `file`: PDF file to upload
- `options`: Upload configuration

**Returns:** Promise with UploadResult

**Throws:** StorageError, ValidationError, UploadError, NetworkError, QuotaError, PermissionError

### deleteFile Function

```typescript
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void>
```

**Parameters:**
- `bucket`: Storage bucket name
- `path`: File path in bucket

**Returns:** Promise that resolves when file is deleted

**Throws:** StorageError, PermissionError, UploadError, NetworkError

## Related Components

- **ImageUpload**: Similar component for image uploads
- **FileUpload**: Generic file upload component
- **FormField**: Form field wrapper component
- **Toast**: Notification component for feedback

## Support

For issues or questions:
1. Check this documentation
2. Review test files for usage examples
3. Check browser console for error messages
4. Review Supabase logs for backend errors
