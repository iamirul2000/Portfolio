# Railway Deployment Guide

## Issue Fixed ✅

The "Script start.sh not found" error has been resolved by adding proper Railway configuration files.

---

## What Was Added

### Frontend Configuration:
- `frontend/railway.json` - Railway deployment settings
- `frontend/nixpacks.toml` - Build and start commands
- Added `http-server` to package.json dependencies

### Backend Configuration:
- `backend/nixpacks.toml` - Laravel build and start commands

---

## Deployment Steps

### Option 1: Deploy as Monorepo (Both Frontend + Backend)

Railway will detect your project structure. You need to create TWO services:

#### Step 1: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `Portfolio` repository
4. Railway will ask which service to deploy
5. Choose "Add Service" → Set root directory to `backend`
6. Add environment variables (see below)
7. Deploy!

#### Step 2: Deploy Frontend

1. In the same Railway project, click "New Service"
2. Choose "GitHub Repo" → Select same repository
3. Set root directory to `frontend`
4. Add environment variable: `API_URL` (your backend URL from step 1)
5. Deploy!

---

### Option 2: Deploy Separately (Recommended)

#### Backend Deployment:

1. Create new Railway project
2. Deploy from GitHub
3. Root directory: `backend`
4. Add these environment variables:

```env
APP_NAME=Portfolio
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME=Portfolio
```

5. After deployment, run migrations:
   - Go to Railway dashboard
   - Click on your backend service
   - Go to "Settings" → "Deploy"
   - Add custom start command: `php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT`

#### Frontend Deployment:

1. Create new Railway project (or add service to existing)
2. Deploy from GitHub
3. Root directory: `frontend`
4. Add environment variable:
   ```env
   API_URL=https://your-backend-domain.railway.app/api/v1
   ```
5. Deploy!

---

## Important: Update Frontend API URL

Before deploying frontend, update the production environment file:

**File:** `frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.railway.app/api/v1'
};
```

Or use Railway's environment variable in your code.

---

## Generate Laravel APP_KEY

Run this locally and copy the key:

```bash
cd backend
php artisan key:generate --show
```

Copy the output (starts with `base64:`) and paste it in Railway's `APP_KEY` environment variable.

---

## Post-Deployment Checklist

### Backend:
- [ ] Check if backend URL is accessible
- [ ] Test API endpoint: `https://your-backend.railway.app/api/v1/profile`
- [ ] Verify database is seeded with data
- [ ] Check logs for any errors

### Frontend:
- [ ] Update `environment.prod.ts` with backend URL
- [ ] Commit and push changes
- [ ] Railway will auto-redeploy
- [ ] Test if frontend can fetch data from backend
- [ ] Test contact form submission
- [ ] Test admin login

---

## Troubleshooting

### "Script start.sh not found"
✅ Fixed! The nixpacks.toml files now tell Railway how to start your app.

### "Module not found" errors
- Make sure `http-server` is in dependencies (already added)
- Run `npm install` locally and commit package-lock.json

### Backend 500 errors
- Check Railway logs
- Verify APP_KEY is set
- Ensure database migrations ran
- Check CORS settings

### Frontend can't connect to backend
- Verify API_URL in environment.prod.ts
- Check CORS_ALLOWED_ORIGINS in backend .env
- Make sure backend URL is correct (include /api/v1)

### Database not seeded
Add this to backend start command in Railway:
```bash
php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

---

## Railway Free Tier Limits

- $5 credit per month
- ~500 hours of usage
- Enough for small portfolio sites
- Apps don't sleep (unlike Render free tier)

---

## Alternative: Use Railway Template

You can also use Railway's templates:
1. Go to Railway dashboard
2. Click "New Project"
3. Search for "Laravel" or "Angular" templates
4. Customize for your needs

---

## Need Help?

If you encounter issues:
1. Check Railway logs (click on service → "Logs" tab)
2. Verify all environment variables are set
3. Make sure both services are deployed
4. Test backend API directly before testing frontend

---

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Go to service settings
   - Add custom domain
   - Update DNS records

2. **Environment Variables**:
   - Update frontend API_URL if backend domain changes
   - Update backend CORS_ALLOWED_ORIGINS if frontend domain changes

3. **Monitoring**:
   - Check Railway dashboard for usage
   - Monitor logs for errors
   - Set up alerts (Railway Pro feature)

---

## Quick Deploy Commands (Run Locally First)

```bash
# Commit new configuration files
git add .
git commit -m "feat: add Railway deployment configuration"
git push origin main

# Railway will auto-deploy on push if connected
```

---

## Success Indicators

✅ Backend deployed: `https://your-backend.railway.app/api/v1/profile` returns data
✅ Frontend deployed: `https://your-frontend.railway.app` loads
✅ API connection works: Frontend displays projects, skills, experiences
✅ Contact form works: Can submit messages
✅ Admin works: Can login and manage content

---

Good luck with your deployment! 🚀
