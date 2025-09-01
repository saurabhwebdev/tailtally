# Authentication System Documentation

This application implements a comprehensive role-based authentication system using MongoDB, JWT tokens, and Next.js API routes.

## Overview

The authentication system provides:
- User registration and login with email/password
- Role-based access control (RBAC)
- Permission-based authorization
- JWT token management with HTTP-only cookies
- Account security features (login attempts, account locking)
- Frontend authentication context for React components

## User Roles and Permissions

### Roles
- **Admin**: Full system access, can manage all users and data
- **Veterinarian**: Can manage pets, appointments, and medical records
- **Staff**: Can manage pets and appointments, read medical records
- **Customer**: Can only view their own pets

### Permissions
- `read_pets`, `write_pets`, `delete_pets`
- `read_users`, `write_users`, `delete_users`
- `read_appointments`, `write_appointments`, `delete_appointments`
- `read_medical_records`, `write_medical_records`, `delete_medical_records`
- `manage_system`, `view_reports`, `manage_billing`

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "professionalInfo": {
    "licenseNumber": "VET123456",
    "specialization": "General Practice",
    "yearsOfExperience": 5,
    "department": "Veterinary",
    "employeeId": "EMP001"
  },
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/logout`
End user session and clear authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/api/auth/me`
Get current authenticated user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* current user object */ }
  }
}
```

### User Management Routes

#### GET `/api/users`
Get users list (admin only) or current user info.

**Query Parameters:**
- `role`: Filter by role
- `search`: Search by name or email
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### POST `/api/users`
Create new user (admin only).

### Pet Management Routes

#### GET `/api/pets`
Get pets list (filtered by user role).

**Query Parameters:**
- `species`: Filter by species
- `owner`: Filter by owner ID (staff+ only)
- `page`: Page number
- `limit`: Items per page

#### POST `/api/pets`
Create new pet record.

## Frontend Authentication

### AuthProvider Setup

Wrap your app with the `AuthProvider`:

```jsx
import { AuthProvider } from '@/contexts/auth-context';

function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### Using the Authentication Hook

```jsx
import { useAuth } from '@/contexts/auth-context';

function Dashboard() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout,
    hasPermission,
    hasRole 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <p>Role: {user.role}</p>
      
      {hasPermission('write_pets') && (
        <button>Add Pet</button>
      )}
      
      {hasRole('admin') && (
        <button>Admin Panel</button>
      )}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Use the `withAuth` HOC or `useRequireAuth` hook:

```jsx
import { withAuth } from '@/contexts/auth-context';

// Using HOC
const AdminPanel = withAuth(AdminComponent, {
  requireRole: 'admin'
});

// Using hook
function VetDashboard() {
  const { isAuthorized } = useRequireAuth({
    requireRole: 'veterinarian'
  });

  if (!isAuthorized) return null;

  return <div>Veterinarian Dashboard</div>;
}
```

## Security Features

### Password Security
- Minimum 6 characters required
- Passwords hashed with bcrypt (cost factor 12)
- Password validation on both frontend and backend

### Account Security
- Account locking after 5 failed login attempts
- 2-hour lockout period
- Login attempt tracking

### Token Security
- JWT tokens with 7-day expiration
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production
- Token verification on every protected request

### Session Management
- Automatic token refresh
- Secure logout with cookie clearing
- Connection pooling and caching for performance

## Environment Configuration

Required environment variables:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Cookie Configuration
COOKIE_NAME=auth_token
COOKIE_SECURE=false  # Set to true in production with HTTPS
```

## Usage Examples

### Login Form
```jsx
import { useAuth } from '@/contexts/auth-context';

function LoginForm() {
  const { login, error, isLoading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Registration Form
```jsx
function SignupForm() {
  const { signup } = useAuth();
  
  const handleSubmit = async (formData) => {
    try {
      await signup(formData);
      // Redirect to dashboard
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name" required />
      <input name="lastName" placeholder="Last Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <select name="role" required>
        <option value="customer">Customer</option>
        <option value="staff">Staff</option>
        <option value="veterinarian">Veterinarian</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Error Handling

The system provides comprehensive error handling:

- **Validation Errors**: Field-specific validation messages
- **Authentication Errors**: Invalid credentials, account locked
- **Authorization Errors**: Insufficient permissions
- **Server Errors**: Database connection, internal errors

Error responses follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Testing the Authentication System

### 1. Test Database Connection
```bash
npm run dev
# Visit http://localhost:3000/api/health
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 3. Test User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Test Protected Routes
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=your_jwt_token_here"
```

This authentication system provides a solid foundation for a pet management application with proper security, role-based access control, and user management capabilities.