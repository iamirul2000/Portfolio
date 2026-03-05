# CSRF Token Mismatch Fix

## Problem
Getting "419 CSRF token mismatch" error when trying to login to the admin panel.

## Root Cause
The issue was caused by incorrect session domain configuration for local development with different ports (backend on port 8000, frontend on port 4200).

## Changes Made

### 1. Updated `.env` file
```env
# Changed from:
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax

# To:
SESSION_DOMAIN=
SESSION_SAME_SITE=none
```

### 2. Updated `config/sanctum.php`
Simplified the stateful domains configuration to explicitly list allowed domains.

## How to Apply the Fix

### Step 1: Clear Configuration Cache
```bash
cd portfolio/backend
php artisan config:clear
php artisan cache:clear
```

### Step 2: Restart the Backend Server
If using Docker:
```bash
cd portfolio
docker-compose restart backend
```

If using PHP artisan serve:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd portfolio/backend
php artisan serve
```

### Step 3: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Clear all cookies for `localhost`
4. Clear Local Storage
5. Close and reopen the browser

### Step 4: Test Login
1. Navigate to `http://localhost:4200`
2. Click "Admin Login" button
3. Enter credentials:
   - Email: admin@example.com (or your admin email)
   - Password: password (or your admin password)
4. Click Login

## Expected Behavior
- CSRF cookie should be set successfully
- Login should work without 419 errors
- Session should persist across requests

## Troubleshooting

### Still Getting 419 Error?

1. **Check Backend is Running**
   ```bash
   curl http://localhost:8000/api/v1/profile
   ```

2. **Verify CSRF Cookie Endpoint**
   ```bash
   curl -v http://localhost:8000/sanctum/csrf-cookie
   ```
   Should return a 204 status with Set-Cookie headers

3. **Check Browser Console**
   - Open DevTools → Network tab
   - Look for the `/sanctum/csrf-cookie` request
   - Check if cookies are being set
   - Verify `withCredentials: true` is set on requests

4. **Verify Environment Variables**
   ```bash
   cd portfolio/backend
   php artisan config:show session
   php artisan config:show sanctum
   ```

### Database Session Table
If using database sessions, ensure the sessions table exists:
```bash
cd portfolio/backend
php artisan migrate
```

## Additional Notes

- `SESSION_SAME_SITE=none` is required for cross-origin requests in local development
- `SESSION_DOMAIN=` (empty) allows cookies to work across different ports on localhost
- For production, you should set proper domain and use `SESSION_SAME_SITE=lax` or `strict`
- Always use HTTPS in production with `SESSION_SECURE_COOKIE=true`

## Production Configuration

For production deployment, update `.env`:
```env
SESSION_DOMAIN=.yourdomain.com
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```
