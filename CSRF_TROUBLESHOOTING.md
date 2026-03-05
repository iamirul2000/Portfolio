# CSRF 419 Error - Complete Troubleshooting Guide

## Current Status
You're getting a 419 error when trying to login. This means the CSRF token is not being validated properly.

## Root Cause Analysis

The issue is that Laravel Sanctum's stateful API authentication requires:
1. ✅ CSRF cookie to be set via `/sanctum/csrf-cookie`
2. ✅ The XSRF-TOKEN cookie to be sent with the login request
3. ✅ The X-XSRF-TOKEN header to match the cookie value
4. ❌ **The session cookie to persist between requests**

## Quick Fix - Try This First

### Step 1: Clear Everything
```powershell
# Stop all containers
cd portfolio
docker-compose down

# Start fresh
docker-compose up -d

# Clear Laravel cache
docker-compose exec api php artisan config:clear
docker-compose exec api php artisan cache:clear
docker-compose exec api php artisan route:clear
```

### Step 2: Clear Browser Completely
1. Close ALL browser tabs
2. Open browser settings
3. Clear ALL browsing data (cookies, cache, everything)
4. Restart browser
5. Or use Incognito/Private mode

### Step 3: Test Login
1. Go to `http://localhost:4200`
2. Open DevTools (F12) → Network tab
3. Click "Admin Login"
4. Watch the network requests:
   - Should see `/sanctum/csrf-cookie` request first
   - Then `/api/v1/auth/login` request
5. Check if cookies are being set in the Response Headers

## Alternative Solution: Use Token-Based Auth

If session-based auth continues to fail, we can switch to token-based authentication:

### Backend Changes Needed:
1. Update AuthController to return tokens instead of sessions
2. Store tokens in localStorage on frontend
3. Send tokens in Authorization header

Would you like me to implement this alternative?

## Debugging Steps

### 1. Check if CSRF Cookie Endpoint Works
```powershell
Invoke-WebRequest -Uri "http://localhost/sanctum/csrf-cookie" -UseBasicParsing -Method GET -SessionVariable session
$session.Cookies
```

You should see cookies being set.

### 2. Check Backend Logs
```powershell
docker-compose logs api --tail=50
```

Look for any errors related to sessions or CSRF.

### 3. Check Session Driver
```powershell
docker-compose exec api php artisan config:show session.driver
```

Should show: `database`

### 4. Verify Sessions Table Exists
```powershell
docker-compose exec api php artisan migrate:status
```

Look for `create_cache_table` migration (includes sessions).

### 5. Test Direct API Call
```powershell
# Get CSRF cookie
$session = $null
Invoke-WebRequest -Uri "http://localhost/sanctum/csrf-cookie" -UseBasicParsing -SessionVariable session

# Try login with session
$body = @{
    email = "admin@amiruliman.dev"
    password = "password"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -WebSession $session `
    -UseBasicParsing
```

## Common Issues and Solutions

### Issue 1: Cookies Not Being Set
**Symptom**: No Set-Cookie headers in response
**Solution**: 
- Check SESSION_DOMAIN is empty in .env
- Check SESSION_SAME_SITE=none in .env
- Restart Docker containers

### Issue 2: CSRF Token Mismatch
**Symptom**: 419 error even with cookies
**Solution**:
- Clear browser cookies completely
- Make sure frontend calls `/sanctum/csrf-cookie` before login
- Check X-XSRF-TOKEN header is being sent

### Issue 3: Session Not Persisting
**Symptom**: Login succeeds but immediately logged out
**Solution**:
- Check database sessions table has entries
- Verify SESSION_DRIVER=database in .env
- Check SESSION_LIFETIME is reasonable (120 minutes)

## Configuration Checklist

### Backend (.env)
```env
SESSION_DRIVER=database
SESSION_DOMAIN=
SESSION_SAME_SITE=none
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:4200,127.0.0.1,127.0.0.1:4200
FRONTEND_URL=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
apiUrl: 'http://localhost/api/v1'
```

### CORS (config/cors.php)
```php
'supports_credentials' => true,
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:4200')],
```

## Next Steps

If none of the above works, I recommend:

1. **Switch to Token-Based Authentication** - More reliable for SPAs
2. **Use a reverse proxy** - Run everything on the same domain
3. **Check for browser extensions** - Some extensions block cookies

Let me know which approach you'd like to take!
