# Updated Render Deployment Guide

## ✅ Fixed the Composer Lock Issue!

I've removed the problematic `composer.lock` file and added proper configuration. Now deployment should work!

---

## Deploy Backend on Render

### 1. Go to Render

Visit: [render.com](https://render.com) and sign up with GitHub

### 2. Create New Web Service

- Click "New +" → "Web Service"
- Select your `Portfolio` repository
- Click "Connect"

### 3. Configure Service

**Basic Settings:**
- **Name:** `portfolio-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Automatically detected (PHP)

**Build & Deploy:**
- **Build Command:**
  ```bash
  bash render-build.sh
  ```
  
  OR if that doesn't work:
  ```bash
  composer install --no-dev --optimize-autoloader && touch database/database.sqlite && php artisan migrate --force && php artisan db:seed --force
  ```

- **Start Command:**
  ```bash
  php artisan serve --host=0.0.0.0 --port=$PORT
  ```

**Instance Type:**
- Select **Free**

### 4. Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

```
APP_NAME=Portfolio
APP_ENV=production
APP_DEBUG=false
APP_KEY=
APP_URL=

DB_CONNECTION=sqlite
DB_DATABASE=/opt/render/project/src/database/database.sqlite

CORS_ALLOWED_ORIGINS=*

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@portfolio.com
MAIL_FROM_NAME=Portfolio
```

**Important:** Leave `APP_KEY` and `APP_URL` empty for now. We'll add them after first deployment.

### 5. Deploy!

- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Render will automatically use PHP 8.2 (from `.php-version` file)
- Composer will generate a fresh `composer.lock` with compatible versions

### 6. After First Deployment

Once deployed, you need to generate APP_KEY:

**Option A: Use Render Shell**
1. Go to your service dashboard
2. Click "Shell" tab
3. Run: `php artisan key:generate --show`
4. Copy the output
5. Go to "Environment" tab
6. Update `APP_KEY` with the copied value
7. Update `APP_URL` with your Render URL (e.g., `https://portfolio-backend.onrender.com`)
8. Save (will trigger redeploy)

**Option B: Generate Locally**
```bash
cd backend
php artisan key:generate --show
```
Copy the output and add to Render environment variables.

### 7. Test Backend

Visit: `https://your-backend-url.onrender.com/api/v1/profile`

Should return JSON with profile data!

---

## Deploy Frontend on Vercel

### 1. Update API URL

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com/api/v1'
};
```

### 2. Commit and Push

```bash
git add .
git commit -m "feat: configure for Render backend"
git push origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. "Add New Project"
4. Import `Portfolio` repository
5. Configure:
   - **Framework:** Angular
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser`
6. Deploy!

### 4. Update CORS

Once Vercel gives you a URL:

1. Go to Render dashboard
2. Your backend service → "Environment"
3. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
4. Save

---

## Why This Works Now

**What was the problem?**
- Your `composer.lock` had Symfony packages locked to versions requiring PHP 8.4+
- But deployment platforms use PHP 8.2

**What did we fix?**
- ✅ Removed `composer.lock` - Render will generate a fresh one
- ✅ Added `.php-version` file - tells Render to use PHP 8.2
- ✅ Created `render-build.sh` - clean build script
- ✅ Composer will now install compatible versions automatically

---

## Troubleshooting

### Build Still Fails

Try updating the build command to:
```bash
composer update --no-dev --optimize-autoloader && touch database/database.sqlite && php artisan migrate --force && php artisan db:seed --force
```

### APP_KEY Error

If you see "No application encryption key has been specified":
1. Generate key locally: `php artisan key:generate --show`
2. Add to Render environment variables
3. Redeploy

### Database Errors

Make sure the database path is correct:
```
DB_DATABASE=/opt/render/project/src/database/database.sqlite
```

### CORS Errors

Update CORS to allow your frontend:
```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:4200
```

---

## Free Tier Notes

**Render Free Tier:**
- Services sleep after 15 min inactivity
- First request takes 30-60 seconds (cold start)
- Perfect for portfolio/demo

**Keep it awake:**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Ping your backend every 10 minutes

---

## Success Checklist

- [ ] Backend deployed on Render
- [ ] APP_KEY generated and added
- [ ] Backend URL returns JSON at `/api/v1/profile`
- [ ] Frontend environment.prod.ts updated
- [ ] Frontend deployed on Vercel
- [ ] CORS configured with Vercel URL
- [ ] Frontend loads and displays data
- [ ] Contact form works
- [ ] Admin login works

---

This should work now! The fresh composer.lock will have compatible package versions. 🚀
