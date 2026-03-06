# Railway Deployment Fix - "Script start.sh not found"

## The Problem

Railway is trying to deploy from the root directory, but your app has two separate parts:
- `frontend/` - Angular app
- `backend/` - Laravel API

## ✅ Solution: Set Root Directory in Railway

You need to tell Railway which folder to deploy from.

---

## Step-by-Step Fix

### Option 1: Configure Existing Service

1. Go to your Railway dashboard
2. Click on your service (the one that's failing)
3. Go to **Settings** tab
4. Scroll down to **Service Settings**
5. Find **Root Directory** field
6. Enter: `frontend` (for Angular) or `backend` (for Laravel)
7. Click **Save**
8. Go back to **Deployments** tab
9. Click **Redeploy** or trigger a new deployment

### Option 2: Delete and Recreate Service (Recommended)

Since the current deployment is failing, it's easier to start fresh:

#### For Frontend:

1. In Railway dashboard, click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose your `Portfolio` repository
4. **IMPORTANT:** In the configuration screen:
   - Set **Root Directory** to: `frontend`
   - Railway will now look inside the frontend folder
5. Click **Deploy**
6. Railway will use the `frontend/nixpacks.toml` configuration

#### For Backend:

1. Click **"New Service"** again (in the same project)
2. Select **"GitHub Repo"**
3. Choose your `Portfolio` repository again
4. **IMPORTANT:** Set **Root Directory** to: `backend`
5. Add environment variables (see below)
6. Click **Deploy**

---

## Environment Variables

### Backend Service:

Add these in Railway's **Variables** tab:

```
APP_NAME=Portfolio
APP_ENV=production
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

CORS_ALLOWED_ORIGINS=*

MAIL_MAILER=log
```

**Important:** Generate APP_KEY locally:
```bash
cd backend
php artisan key:generate --show
```
Copy the output and add it as `APP_KEY` variable in Railway.

### Frontend Service:

No environment variables needed initially. After backend is deployed, you'll update the frontend code with the backend URL.

---

## After Deployment

### 1. Get Backend URL
- Go to backend service in Railway
- Copy the public URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### 2. Update Frontend Code

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.railway.app/api/v1'
};
```

### 3. Update Backend CORS

In Railway backend variables, update:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: update production API URL"
git push origin main
```

Railway will auto-redeploy both services.

---

## Verification

### Backend is working:
Visit: `https://your-backend-url.railway.app/api/v1/profile`

Should return JSON with profile data.

### Frontend is working:
Visit: `https://your-frontend-url.railway.app`

Should load your portfolio site.

---

## Alternative: Use Railway CLI

If you prefer command line:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy frontend
railway up --service frontend

# Deploy backend
railway up --service backend
```

---

## Why This Happens

Railway tries to auto-detect your project type from the root directory. Since you have a monorepo with both frontend and backend, it gets confused. By setting the **Root Directory**, you tell Railway exactly where to look.

---

## Quick Checklist

- [ ] Delete failing service (optional)
- [ ] Create new service with Root Directory = `frontend`
- [ ] Create new service with Root Directory = `backend`
- [ ] Add environment variables to backend
- [ ] Wait for backend to deploy
- [ ] Copy backend URL
- [ ] Update frontend environment.prod.ts
- [ ] Update backend CORS settings
- [ ] Commit and push
- [ ] Verify both services work

---

## Still Having Issues?

If Railway still can't find the configuration:

1. Make sure you pushed the latest code to GitHub
2. Verify `frontend/nixpacks.toml` and `backend/nixpacks.toml` exist in your repo
3. Try disconnecting and reconnecting the GitHub repo in Railway
4. Check Railway logs for specific error messages

---

Good luck! 🚀
