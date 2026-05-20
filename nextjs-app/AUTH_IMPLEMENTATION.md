# Authentication Implementation

This document describes the authentication system implemented for the portfolio admin panel.

## Overview

The authentication system provides secure login/logout functionality for admin users with the following features:

- **Password Hashing**: Bcrypt with 10 salt rounds (OWASP recommended)
- **Session Management**: JWT-based tokens with 24-hour expiration
- **HTTP-Only Cookies**: Secure session storage preventing XSS attacks
- **CSRF Protection**: SameSite=Strict cookie flag
- **Rate Limiting**: 5 failed attempts per 15 minutes per email
- **Audit Logging**: All login/logout events logged with IP and user agent
- **Input Validation**: Zod schema validation on all inputs

## API Endpoints

### POST /api/auth/login

Authenticate an admin user with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "user-123",
      "email": "admin@example.com",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "expiresIn": 86400
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**Response (429 Too Many Requests):**
```json
{
  "error": "Too many login attempts. Please try again later."
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**Headers:**
- Sets `Set-Cookie` header with HTTP-only session token
- Cookie expires in 24 hours
- Secure flag enabled in production
- SameSite=Strict for CSRF protection

### POST /api/auth/logout

Logout the current admin user by clearing the session cookie.

**Request:**
```
POST /api/auth/logout
Cookie: session_token=<token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

**Headers:**
- Clears `Set-Cookie` header with Max-Age=0

### GET /api/auth/session

Get the current session information.

**Request:**
```
GET /api/auth/session
Cookie: session_token=<token>
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "user-123",
      "email": "admin@example.com",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

## Security Features

### Password Hashing

Passwords are hashed using bcrypt with 10 salt rounds:

```typescript
import { hashPassword, verifyPassword } from '@/lib/auth';

// Hash a password
const hash = await hashPassword('SecurePassword123!');

// Verify a password
const isValid = await verifyPassword('SecurePassword123!', hash);
```

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Session Tokens

Session tokens are JWT-based with the following properties:

- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Payload**:
  ```typescript
  {
    userId: string;
    email: string;
    iat: number;  // Issued at
    exp: number;  // Expiration time
  }
  ```

### Cookie Security

Session cookies are configured with:

- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: HTTPS only in production
- **SameSite=Strict**: CSRF protection
- **Max-Age**: 86400 seconds (24 hours)
- **Path**: /

### Rate Limiting

Login attempts are rate-limited to prevent brute force attacks:

- **Limit**: 5 failed attempts per email
- **Window**: 15 minutes
- **Response**: 429 Too Many Requests

The rate limit is cleared on successful login.

### Audit Logging

All authentication events are logged:

- **Login**: Recorded with timestamp, user ID, IP address, user agent
- **Logout**: Recorded with timestamp, user ID, IP address, user agent

Logs are stored in the `audit_logs` table and retained for 90 days.

## Implementation Details

### File Structure

```
src/
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── auth.test.ts         # Auth utility tests
│   ├── db.ts                # Database queries
│   └── validation.ts        # Zod schemas
├── app/
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts         # Login endpoint
│           ├── logout/
│           │   └── route.ts         # Logout endpoint
│           ├── session/
│           │   └── route.ts         # Session endpoint
│           └── login.test.ts        # Login endpoint tests
└── types/
    └── index.ts             # TypeScript types
```

### Key Functions

#### `hashPassword(password: string): Promise<string>`

Hash a password using bcrypt.

```typescript
const hash = await hashPassword('SecurePassword123!');
```

#### `verifyPassword(password: string, hash: string): Promise<boolean>`

Verify a password against a hash.

```typescript
const isValid = await verifyPassword('SecurePassword123!', hash);
```

#### `generateSessionToken(userId: string, email: string): string`

Generate a JWT session token.

```typescript
const token = generateSessionToken('user-123', 'admin@example.com');
```

#### `verifySessionToken(token: string): SessionPayload | null`

Verify and decode a JWT session token.

```typescript
const payload = verifySessionToken(token);
if (payload) {
  console.log(payload.userId, payload.email);
}
```

#### `getSessionFromHeaders(headers: Record<string, string | string[] | undefined>): SessionPayload | null`

Extract and verify session from request headers.

```typescript
const session = getSessionFromHeaders(request.headers);
if (!session) {
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}
```

### Database Queries

#### `findAdminUserByEmail(email: string): Promise<AdminUser & { passwordHash: string } | null>`

Find an admin user by email.

```typescript
const user = await findAdminUserByEmail('admin@example.com');
if (user) {
  const isValid = await verifyPassword(password, user.passwordHash);
}
```

#### `findAdminUserById(userId: string): Promise<AdminUser | null>`

Find an admin user by ID.

```typescript
const user = await findAdminUserById('user-123');
```

#### `updateAdminUserLastLogin(userId: string): Promise<AdminUser>`

Update admin user's last login timestamp.

```typescript
const user = await updateAdminUserLastLogin('user-123');
```

#### `createAuditLog(entry: AuditLogEntry): Promise<void>`

Create an audit log entry.

```typescript
await createAuditLog({
  adminUserId: 'user-123',
  action: 'LOGIN',
  entityType: 'admin_user',
  entityId: 'user-123',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});
```

## Testing

The authentication system includes comprehensive tests:

### Unit Tests (`src/lib/auth.test.ts`)

- Password hashing and verification
- JWT token generation and verification
- Session expiration
- Cookie formatting
- Session token extraction

**Run tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Generate coverage report:**
```bash
npm run test:coverage
```

### Integration Tests (`src/app/api/auth/login.test.ts`)

- Input validation
- Authentication flow
- Rate limiting
- Audit logging
- Error handling

## Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret-min-32-chars

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Usage Example

### Login Flow

```typescript
// 1. User submits login form
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'SecurePassword123!',
  }),
});

// 2. Session cookie is automatically set by browser
// 3. Subsequent requests include the session cookie

// 4. Check session
const sessionResponse = await fetch('/api/auth/session');
const { data } = await sessionResponse.json();
console.log(data.user.email); // admin@example.com
```

### Logout Flow

```typescript
// 1. User clicks logout
const response = await fetch('/api/auth/logout', {
  method: 'POST',
});

// 2. Session cookie is cleared
// 3. Redirect to login page
```

### Protected Routes

```typescript
// Middleware to protect routes
import { getSessionFromHeaders } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = getSessionFromHeaders(
    Object.fromEntries(request.headers.entries())
  );

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## Acceptance Criteria Met

✅ **Authentication endpoints functional**
- POST /api/auth/login - Authenticates users
- POST /api/auth/logout - Clears sessions
- GET /api/auth/session - Validates sessions

✅ **Passwords hashed**
- Bcrypt with 10 salt rounds
- Minimum 8 characters with mixed case, numbers, symbols
- Never stored in plain text

✅ **Sessions secure**
- JWT tokens with 24-hour expiration
- HTTP-only cookies prevent XSS
- SameSite=Strict prevents CSRF
- Rate limiting prevents brute force
- Audit logging tracks all access

## Next Steps

1. Implement frontend login page component
2. Create protected route middleware
3. Implement session persistence in frontend
4. Add logout functionality to admin panel
5. Create admin user management endpoints
6. Implement password reset functionality
