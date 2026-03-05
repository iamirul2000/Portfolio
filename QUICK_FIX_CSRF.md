# Quick Fix for CSRF 419 Error

## The Problem
You're getting a "419 CSRF token mismatch" error when trying to login.

## The Solution
I've updated the configuration files. Now you need to apply the changes.

## Steps to Fix (Choose ONE method)

### Method 1: Using Docker (Recommended)

1. **Start Docker containers**
   ```bash
   cd portfolio
   docker-compose up -d
   ```

2. **Clear Laravel cache**
   ```bash
   docker-compose exec backend php artisan config:clear
   docker-compose exec backend php artisan cache:clear
   ```

3. **Clear browser data**
   - Press F12 to open DevTools
   - Go to Application tab (Chrome) or Storage tab (Firefox)
   - Delete all cookies for `localhost`
   - Clear Local Storage
   - Close and reopen browser

4. **Test login**
   - Go to `http://localhost:4200`
   - Click "Admin Login"
   - Login with your credentials

### Method 2: Without Docker

1. **Start backend server**
   ```bash
   cd portfolio/backend
   # Make sure you have PHP 8.2+ installed
   php artisan serve
   ```

2. **In a new terminal, clear cache**
   ```bash
   cd portfolio/backend
   php artisan config:clear
   php artisan cache:clear
   ```

3. **Start frontend**
   ```bash
   cd portfolio/frontend
   npm start
   ```

4. **Clear browser data** (same as Method 1 step 3)

5. **Test login** (same as Method 1 step 4)

## What Was Changed

### Backend Configuration
1. **`.env` file**:
   - `SESSION_DOMAIN=` (empty, was `localhost`)
   - `SESSION_SAME_SITE=none` (was `lax`)

2. **`config/sanctum.php`**:
   - Simplified stateful domains configuration

These changes allow cookies to work properly across different ports in local development.

## Default Admin Credentials

The admin user already exists in your database:
- **Email**: `admin@amiruliman.dev`
- **Password**: `password` (default)

If you need to reset the password, run:
```bash
docker-compose exec api php artisan tinker
```

Then in tinker:
```php
$user = \App\Models\User::where('email', 'admin@amiruliman.dev')->first();
$user->password = bcrypt('password');
$user->save();
echo "Password reset to: password\n";
exit
```

## Still Not Working?

### Check if backend is running:
```bash
curl http://localhost:8000/api/v1/profile
```

### Check CSRF cookie endpoint:
```bash
curl -v http://localhost:8000/sanctum/csrf-cookie
```

Should return 204 status with Set-Cookie headers.

### Verify Docker containers:
```bash
cd portfolio
docker-compose ps
```

All services should show "Up" status.

## Need Help?

If you're still having issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check the Network tab to see the actual request/response
3. Verify both frontend (4200) and backend (8000) are running
4. Make sure you cleared browser cookies completely
