# Testing Resume Upload Feature

## Prerequisites
- Next.js dev server running on `http://localhost:3000`
- Admin account logged in
- Browser DevTools console open (F12)

## Step-by-Step Testing

### 1. Navigate to Admin Profile Settings
```
URL: http://localhost:3000/admin/profile
```

### 2. Locate the Upload Resume Button
- Look for the "📄 Upload Resume/CV" button in the Settings card
- Click it to expand the upload form

### 3. Select a PDF File
- Click the file input field
- Choose a PDF file from your computer (max 5MB)
- You should see the file name and size displayed

### 4. Click Upload Button
- Click the blue "Upload Resume" button
- Watch the browser console for debug messages

### 5. Monitor Console Output
Expected console messages in order:

```
Resume upload started { resumeFile: File }
Creating FormData and uploading to /api/upload/pdf
Upload response status: 201
Upload successful, got URL: https://...
Updating profile with resume URL
Update response status: 200
Resume update successful
```

### 6. Verify Success
- Green success message should appear: "Resume uploaded successfully!"
- Form should close automatically
- File input should be cleared

### 7. Test Download on Home Page
```
URL: http://localhost:3000
```
- Scroll to Hero section
- Click "Unduh CV" button
- Resume PDF should open in new tab

## Troubleshooting

### If Upload Fails

#### Error: "Only PDF files are allowed"
- **Cause**: Selected file is not a PDF
- **Fix**: Select a .pdf file

#### Error: "File size must be less than 5MB"
- **Cause**: PDF file is too large
- **Fix**: Compress PDF or select smaller file

#### Error: "Upload failed with status 400"
- **Cause**: File validation failed on server
- **Check Console**: Look for validation error message
- **Fix**: Verify file is valid PDF

#### Error: "Upload failed with status 401"
- **Cause**: Not authenticated or session expired
- **Fix**: Log out and log back in

#### Error: "Upload failed with status 500"
- **Cause**: Server error during upload
- **Check Console**: Look for detailed error message
- **Check Server Logs**: Look for errors in terminal

#### Error: "Update failed with status 401"
- **Cause**: Session expired during upload
- **Fix**: Log out and log back in, try again

#### Error: "Update failed with status 500"
- **Cause**: Database error when saving resume URL
- **Check Console**: Look for detailed error message
- **Possible Issues**:
  - `resume_url` column doesn't exist in profiles table
  - User profile doesn't exist
  - Database connection issue

### If Download Button Doesn't Work

#### Button is disabled/grayed out
- **Cause**: Resume URL not fetched yet
- **Fix**: Wait a moment for page to load, refresh page

#### Button is enabled but clicking does nothing
- **Cause**: Resume URL is null
- **Fix**: Upload resume first via admin panel

#### Error: "Resume tidak tersedia"
- **Cause**: No resume URL in database
- **Fix**: Upload resume via admin panel

#### PDF doesn't open
- **Cause**: Invalid URL or file deleted from storage
- **Fix**: Re-upload resume

## Database Verification

### Check if resume_url column exists:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'resume_url';
```

### Check if resume URL is saved:
```sql
SELECT id, user_id, resume_url 
FROM profiles 
WHERE resume_url IS NOT NULL;
```

### Check Supabase Storage:
1. Go to Supabase Dashboard
2. Navigate to Storage
3. Check `portfolio-pdfs` bucket
4. Look for `resumes/` folder
5. Verify uploaded PDF files are there

## Performance Notes

- First upload may take 2-5 seconds (file upload + database update)
- Subsequent uploads should be faster
- Resume URL is cached on home page (1 hour cache)
- Refresh page to see updated resume URL

## Security Notes

- Only authenticated admin users can upload
- File type validated (PDF only)
- File size limited (5MB max)
- Files stored in Supabase Storage with public access
- Resume URL stored in database with user association

## Success Criteria

✅ File selected and displayed
✅ Upload button shows "Uploading..." state
✅ Console shows all expected debug messages
✅ Success message appears
✅ Form closes automatically
✅ Resume URL saved to database
✅ Download button works on home page
✅ PDF opens in new tab
