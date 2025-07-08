# 🔐 H4ck3r L4bs Authentication System - Quick Start Guide

## 🎯 Overview

The H4ck3r L4bs frontend now has a complete authentication system with admin dashboard protection. The system works in both production (with Railway backend) and development mode (with fallback credentials).

## 🚀 Quick Start

### 1. Installation & Setup

```bash
# Clone and install dependencies
git clone https://github.com/MiguelBonilla-sys/frontend_hack3rlabs.git
cd frontend_hack3rlabs
npm install

# Set up environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

### 2. Login Credentials

#### Production Mode (Railway Backend Available)
- **Username**: `admin`
- **Password**: `Hack3r2024!@#`

#### Development Mode (Fallback)
- **Username**: `admin` 
- **Password**: `Hack3r2024!@#`
- **Username**: `testuser`
- **Password**: `test123`

## 🔒 Authentication Flow

### Route Protection
- **Protected Routes**: All `/admin/*` paths require authentication
- **Public Routes**: `/`, `/cursos`, `/noticias`, `/ofertas`, `/proyectos`, `/login`
- **Auto-redirect**: Unauthenticated users accessing `/admin` → `/login`
- **Auto-redirect**: Authenticated users accessing `/login` → `/admin`

### Login Process
1. Navigate to `/login`
2. Enter valid credentials
3. System attempts Railway backend connection
4. If backend unavailable → Falls back to development mode
5. On success → Redirects to `/admin` dashboard

## 📊 Admin Dashboard Features

### Available Sections
- **Dashboard**: Overview with stats and quick links
- **Cursos**: Course management interface
- **Noticias**: News management interface  
- **Proyectos**: Project management interface
- **Integrantes**: Team member management
- **Ofertas**: Job offer management
- **Conferencias**: Conference management

### User Permissions
- **Superusers**: Full access to all sections
- **Staff**: Access based on specific permissions
- **Regular Users**: No admin access

## 🛠️ Development Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://apihack3r-production.up.railway.app
NEXT_PUBLIC_API_BASE_URL=https://apihack3r-production.up.railway.app
NEXT_PUBLIC_DEV_MODE=true  # Enable development fallback

# Feature Flags
NEXT_PUBLIC_ENABLE_ADMIN=true
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Development Mode Benefits
- **Offline Development**: Works without backend connection
- **Mock Authentication**: Uses predefined development credentials
- **Error Resilience**: Graceful handling of API unavailability
- **Quick Testing**: Instant login without network requests

## 🔧 Technical Details

### Authentication Store (Zustand)
- **Persistent**: Stores user data and tokens in localStorage
- **Secure**: Automatic token cleanup on logout/expiration
- **Reactive**: Real-time authentication state across components

### Middleware Protection
- **File**: `middleware.ts`
- **Scope**: Protects `/admin/*` routes automatically
- **Cookies**: Checks for `auth_token` cookie presence
- **Fallback**: Redirects to `/login` when unauthorized

### Permission System
- **Superuser Override**: Superusers bypass all permission checks
- **API Integration**: Fetches detailed permissions from backend
- **Graceful Degradation**: Works even when API unavailable

## 🚨 Troubleshooting

### Login Not Working
1. Check if development mode is enabled: `NEXT_PUBLIC_DEV_MODE=true`
2. Clear localStorage: `localStorage.clear()` in browser console
3. Verify credentials match the predefined list
4. Check browser console for error messages

### Admin Access Denied
1. Ensure user has `is_staff: true` or `is_superuser: true`
2. Check permission system logs in browser console
3. Verify authentication token is present in cookies

### API Connection Issues
- **Expected Behavior**: System should fall back to development mode
- **Check Environment**: Ensure `.env.local` exists with proper variables
- **Network**: API unavailability is handled gracefully

## 📁 Key Files

- `middleware.ts` - Route protection logic
- `lib/auth.ts` - Main authentication store
- `lib/hooks/usePermissions.ts` - Permission management
- `app/admin/layout.tsx` - Admin layout with protection
- `components/auth/PermissionGuard.tsx` - Component-level protection

## 🎯 Testing the System

```bash
# 1. Build the project
npm run build

# 2. Start development server
npm run dev

# 3. Test routes
# - Visit http://localhost:3000/admin (should redirect to login)
# - Login with credentials above
# - Should redirect to admin dashboard
# - Navigate between admin sections

# 4. Test logout
# - Clear localStorage in browser
# - Try accessing /admin again
# - Should redirect to login
```

## ✅ Success Criteria

The authentication system is working correctly when:
- [x] Unauthenticated `/admin` access redirects to `/login`
- [x] Valid login redirects to `/admin` dashboard
- [x] Admin sections are accessible with proper permissions
- [x] User info displays correctly in header
- [x] System works both online and offline
- [x] Build completes without errors
- [x] TypeScript validation passes

---

**🔐 Security Note**: Development credentials are for testing only. In production, ensure proper user management through the Django backend admin interface.