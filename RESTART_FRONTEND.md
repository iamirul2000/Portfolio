# Restart Frontend to Apply Token Auth Changes

## The Problem
The frontend is still using the old session-based authentication code. You need to restart the Angular development server to pick up the new token-based authentication changes.

## Solution

### Step 1: Stop the Frontend Server
In the terminal where `npm start` is running:
- Press `Ctrl + C` to stop the server

### Step 2: Start the Frontend Server Again
```bash
cd portfolio/frontend
npm start
```

Wait for it to compile (you'll see "Compiled successfully")

### Step 3: Clear Browser and Test
1. Open browser (or use Incognito mode)
2. Press F12 → Application tab
3. Clear all localStorage items
4. Clear all cookies
5. Go to `http://localhost:4200`
6. Click "Admin Login"
7. Enter:
   - Email: `admin@amiruliman.dev`
   - Password: `password`
8. Click Login

## What Should Happen

### Success Indicators:
1. ✅ No 419 error
2. ✅ Login request returns `{ data: { user: {...}, token: "..." } }`
3. ✅ Token is stored in localStorage (check DevTools → Application → Local Storage)
4. ✅ Redirected to `/admin/dashboard`
5. ✅ Subsequent requests have `Authorization: Bearer ...` header

### If It Still Doesn't Work:

1. **Check if frontend restarted properly**:
   - Look for "Compiled successfully" message
   - Check browser console for any compilation errors

2. **Verify changes are loaded**:
   - Open DevTools → Sources tab
   - Find `auth.service.ts`
   - Check if it has `localStorage.setItem('auth_token', ...)` code

3. **Check Network tab**:
   - Look at the login POST request
   - Check the response - should include `token` field
   - If response still doesn't have `token`, backend might not have restarted

4. **Force refresh**:
   - Press `Ctrl + Shift + R` (hard refresh)
   - Or clear browser cache completely

## Quick Test Command

To verify backend is returning tokens:
```powershell
$body = @{
    email = "admin@amiruliman.dev"
    password = "password"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

The response should include a `token` field in the JSON.

## Still Having Issues?

If after restarting the frontend you still get 419 errors, it means:
1. Frontend code didn't reload properly
2. Browser is caching old JavaScript files
3. There's a build/compilation error

Try:
- Delete `portfolio/frontend/.angular` folder
- Delete `portfolio/frontend/node_modules/.cache` folder
- Restart the dev server
- Use Incognito mode to test
