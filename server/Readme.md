# Vigilance Guard Management System - Server

This is the Express.js server for the Vigilance Guard Management System that connects to Supabase.

## Setup

1. **Install dependencies**:

   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**:

   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     PORT=3001
     SUPABASE_URL=your_supabase_url_here
     SUPABASE_ANON_KEY=your_supabase_anon_key_here
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
     NODE_ENV=development
     ```

3. **Start the server**:

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile/:userId` - Get user profile

### Guards

- `GET /api/guards` - Get all guards
- `GET /api/guards/:id` - Get guard by ID
- `POST /api/guards` - Create new guard
- `PUT /api/guards/:id` - Update guard
- `DELETE /api/guards/:id` - Delete guard
- `GET /api/guards/:id/assignments` - Get guard assignments

### Attendance

- `GET /api/attendance` - Get attendance records (with filters)
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `GET /api/attendance/stats` - Get attendance statistics

### Health Check

- `GET /health` - Check server and database connectivity

## Features

- **Security**: Helmet.js for security headers
- **CORS**: Configured for frontend communication
- **Logging**: Morgan for request logging
- **Error Handling**: Centralized error handling
- **Supabase Integration**: Full database operations
- **Environment Support**: Development and production configs

## Development

The server uses nodemon for development auto-reloading. Make sure your frontend is running on `http://localhost:5173` for CORS to work properly.

## Testing

Test the server health:

```bash
curl http://localhost:3001/health
```

Test basic functionality:

```bash
curl http://localhost:3001/api/guards
```
