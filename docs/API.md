# API Documentation

## Portfolio Data
- **GET /api/portfolio**: Fetches all portfolio content (hero, tech stack, projects, etc.)

## Authentication
- **POST /api/auth/login**: Sign in with email/password
- **POST /api/auth/logout**: Sign out
- **GET /api/auth/session**: Get current session state

## Admin (Protected)
- **POST/PUT/DELETE /api/admin/***: Content management endpoints (requires auth)