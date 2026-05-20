# Logout Functionality Implementation

## Overview

This document describes the complete logout functionality implementation for the admin panel. The logout feature securely clears user sessions, removes HTTP-only cookies, and redirects users to the login page.

## Features Implemented

### 1. Logout API Endpoint (`/api/auth/logout`)

**Location:** `src/app/api/auth/logout/route.ts`

**Functionality:**
- Validates user session from request headers
- Creates audit log entry for logout action
- Clears session cookie with secure flags
- Returns success message on logout
- Handles errors gracefully

**Security Features:**
- HTTP-only cookie (prevents XSS access)
- Secure flag (HTTPS only in production)
- SameSite=Strict (CSRF protection)
- Max-Age=0 (immediate cookie expiration)
- Audit logging with IP address and user agent

**Response Codes:**
- `200 OK`: Successful logout
- `401 Unauthorized`: No valid session
- `500 Internal Server Error`: Server error

### 2. useLogout Hook

**Location:** `src/lib/useLogout.ts`

**Functionality:**
- Calls logout API endpoint with credentials
- Manages loading state during logout
- Handles errors gracefully
- Redirects to login page on success
- Provides error messages to UI

**Features:**
- Loading state management
- Error state management
- Automatic redirect after logout
- Proper error message extraction from API response
- Small delay before redirect to ensure cookie is cleared

**Usage:**
```typescript
const { logout, isLoading, error } = useLogout();

// Call logout
await logout();

// Check states
if (isLoading) {
  // Show loading indicator
}

if (error) {
  // Show error message
}
```

### 3. Sidebar Logout Button

**Location:** `src/components/admin/Sidebar.tsx`

**Features:**
- Logout button in user profile section
- Shows loading state during logout
- Disabled during logout process
- Red styling to indicate destructive action
- Accessible from all admin pages

**Styling:**
- Red background with transparency
- Red border
- Red text
- Hover effects
- Disabled state styling

### 4. Profile Page Logout Button

**Location:** `src/components/admin/ProfileSettings.tsx`

**Features:**
- Logout button in settings card
- Shows loading state during logout
- Displays error messages if logout fails
- Disabled during logout process
- Door emoji icon for visual clarity
- Accessible from profile page

**Error Handling:**
- Displays error alert if logout fails
- Allows user to retry logout
- Shows specific error messages

## Security Implementation

### Session Clearing

The logout process ensures complete session clearing:

1. **Cookie Removal**
   - Sets `Max-Age=0` to expire cookie immediately
   - Sets `Expires` to epoch time (Jan 1, 1970)
   - Maintains all security flags (HttpOnly, Secure, SameSite)

2. **Session Validation**
   - Verifies session exists before logout
   - Returns 401 if no valid session
   - Prevents unauthorized logout attempts

3. **Audit Logging**
   - Logs logout action with timestamp
   - Records user ID and email
   - Captures IP address and user agent
   - Enables security monitoring

### HTTP-Only Cookies

The session token is stored in an HTTP-only cookie with:
- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: HTTPS only in production
- `SameSite=Strict`: CSRF protection
- `Path=/`: Available to entire application
- `Max-Age`: 24 hours expiration

## User Experience

### Logout Flow

1. **User Initiates Logout**
   - Clicks logout button in sidebar or profile page
   - Button shows loading state ("Logging out...")
   - Button is disabled to prevent multiple clicks

2. **API Call**
   - Sends POST request to `/api/auth/logout`
   - Includes credentials to send session cookie
   - Waits for server response

3. **Session Clearing**
   - Server validates session
   - Creates audit log entry
   - Clears session cookie
   - Returns success response

4. **Redirect**
   - Client receives success response
   - Small delay (100ms) to ensure cookie is cleared
   - Redirects to login page
   - User is logged out

### Error Handling

If logout fails:
1. Error message is displayed to user
2. Button returns to normal state
3. User can retry logout
4. Specific error message helps troubleshooting

## Integration Points

### Sidebar Integration

The logout button is integrated into the sidebar's user profile section:
- Located at bottom of sidebar
- Always visible to logged-in users
- Accessible from all admin pages
- Responsive on mobile devices

### Profile Page Integration

The logout button is integrated into the profile settings:
- Located in settings card
- Alongside other account options
- Displays error messages if logout fails
- Consistent styling with other settings

## Testing Considerations

### Manual Testing

1. **Successful Logout**
   - Click logout button
   - Verify redirect to login page
   - Verify session cookie is cleared
   - Verify cannot access protected routes

2. **Error Handling**
   - Simulate network error
   - Verify error message displays
   - Verify button returns to normal state
   - Verify can retry logout

3. **Loading State**
   - Click logout button
   - Verify button shows "Logging out..."
   - Verify button is disabled
   - Verify loading state clears after redirect

4. **Audit Logging**
   - Check audit logs after logout
   - Verify logout action is recorded
   - Verify user ID and email are correct
   - Verify IP address is captured

### Browser Testing

- Test in Chrome, Firefox, Safari, Edge
- Test on mobile devices
- Test with slow network (throttle to 3G)
- Test with cookies disabled (should fail gracefully)

## API Documentation

### POST /api/auth/logout

**Request:**
```
POST /api/auth/logout
Cookie: session_token=<token>
```

**Response (Success):**
```json
{
  "message": "Logged out successfully"
}
```

**Response (Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

**Response (Server Error):**
```json
{
  "error": "Internal server error"
}
```

**Headers Set:**
```
Set-Cookie: session_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure
```

## Configuration

### Environment Variables

No additional environment variables required. Uses existing:
- `JWT_SECRET`: For session token verification
- `NODE_ENV`: For secure cookie flag (production only)

### Cookie Configuration

Located in `src/lib/auth.ts`:
- `SESSION_COOKIE_NAME`: "session_token"
- `SESSION_EXPIRATION_HOURS`: 24
- `BCRYPT_SALT_ROUNDS`: 10

## Troubleshooting

### Logout Button Not Working

1. **Check Session**
   - Verify user is logged in
   - Check browser cookies for session_token
   - Verify session token is valid

2. **Check Network**
   - Open browser DevTools
   - Check Network tab for logout request
   - Verify request returns 200 status
   - Check response headers for Set-Cookie

3. **Check Redirect**
   - Verify redirect to login page occurs
   - Check browser console for errors
   - Verify login page is accessible

### Session Not Clearing

1. **Check Cookie Settings**
   - Verify HttpOnly flag is set
   - Verify Secure flag is set in production
   - Verify SameSite=Strict is set
   - Verify Max-Age=0 is set

2. **Check Browser**
   - Clear browser cache
   - Clear cookies manually
   - Try different browser
   - Try incognito/private mode

### Audit Log Not Recording

1. **Check Database**
   - Verify audit_logs table exists
   - Verify database connection is working
   - Check database logs for errors

2. **Check Permissions**
   - Verify user has permission to create audit logs
   - Verify RLS policies allow audit log creation

## Future Enhancements

1. **Session Management**
   - Add "remember me" functionality
   - Implement session timeout warnings
   - Add active sessions management

2. **Security**
   - Add logout confirmation dialog
   - Implement device fingerprinting
   - Add suspicious activity detection

3. **User Experience**
   - Add logout animation
   - Show logout success message
   - Add keyboard shortcut for logout

## References

- [HTTP-Only Cookies](https://owasp.org/www-community/attacks/xss/#stored-xss-attacks)
- [CSRF Protection](https://owasp.org/www-community/attacks/csrf)
- [Session Management](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/README)
- [Secure Cookie Flags](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

## Checklist

- [x] Logout API endpoint implemented
- [x] useLogout hook implemented
- [x] Sidebar logout button added
- [x] Profile page logout button added
- [x] Session cookie clearing implemented
- [x] Audit logging implemented
- [x] Error handling implemented
- [x] Loading state implemented
- [x] Redirect to login implemented
- [x] Build verification passed
- [x] Security review completed
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests written
- [ ] Manual testing completed
- [ ] Documentation completed

## Status

✅ **Implementation Complete**

The logout functionality has been successfully implemented with:
- Secure session clearing
- HTTP-only cookie removal
- Proper error handling
- Loading state management
- Audit logging
- User-friendly UI

The feature is ready for testing and deployment.
