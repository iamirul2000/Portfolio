# Easy Deployment Guide - Vercel + Railway

## The Problem with Railway Monorepo

Railway gets confused when you have both frontend and backend in the same repo. It tries to run frontend commands on backend and vice versa.

## ✅ Better Solution: Split Deployment

- **Backend on Railway** (Laravel API)
- **Frontend on Vercel** (Angular - FREE, unlimited bandwidth)

This is actually the BEST approach for your portfolio!

---

## Part 1: Deploy Backend on Railway

### Step 1: Choose Backend Directory

In Railway settings:
- **Root Directory:** Select `backend`
- Click Deploy

### Step 2: Add Environment Variables

Go to **Variables** tab and add:

```env
APP_NAME=Portfolio
APP_ENV=production
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

CORS_ALLOWED_ORIGINS=*

MAIL_MAILER=log
```

### Step 3: Generate APP_KEY

Run locally:
```bash
cd backend
php artisan key:generate --show
```

Copy the output (e.g., `base64:xxxxx`) and add it as `APP_KEY` in Railway variables.

### Step 4: Deploy and Get URL

- Wait for deployment to complete
- Copy your backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)
- Test it: Visit `https://your-backend-url.railway.app/api/v1/profile`

---

## Part 2: Deploy Frontend on Vercel (FREE!)

### Why Vercel?
- ✅ Completely FREE for personal projects
- ✅ Unlimited bandwidth
- ✅ Global CDN (super fast)
- ✅ Auto-deploy from GitHub
- ✅ No credit card required
- ✅ Perfect for Angular/React/Vue

### Step 1: Update Frontend API URL

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.railway.app/api/v1'
};
```

Replace `your-backend-url` with your actual Railway backend URL.

### Step 2: Commit Changes

```bash
git add .
git commit -m "feat: update production API URL for Railway backend"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (use GitHub account)
3. Click **"Add New Project"**
4. Import your `Portfolio` repository
5. Configure:
   - **Framework Preset:** Angular
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser`
6. Click **Deploy**

### Step 4: Update Backend CORS

Once Vercel gives you a URL (e.g., `https://portfolio-xxxx.vercel.app`):

1. Go back to Railway
2. Update `CORS_ALLOWED_ORIGINS` variable:
   ```
   CORS_ALLOWED_ORIGINS=https://portfolio-xxxx.vercel.app
   ```
3. Railway will auto-redeploy

---

## Part 3: Verification

### Test Backend:
Visit: `https://your-backend.railway.app/api/v1/profile`

Should return JSON:
```json
{
  "data": {
    "name": "Your Name",
    "title": "Full Stack Developer",
    ...
  }
}
```

### Test Frontend:
Visit: `https://your-portfolio.vercel.app`

Should load your portfolio and display:
- Projects
- Skills
- Experience
- Contact form should work

---

## Alternative: If You Really Want Railway for Both

If you insist on using Railway for both, you need to:

### Option A: Create TWO Separate GitHub Repos

1. Create `portfolio-backend` repo (only backend code)
2. Create `portfolio-frontend` repo (only frontend code)
3. Deploy each separately on Railway

### Option B: Use Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy backend
cd backend
railway up

# Deploy frontend (in new terminal)
cd frontend
railway up
```

---

## Recommended: Vercel + Railway

This is the industry-standard approach:

**Benefits:**
- Frontend on Vercel: FREE, fast, unlimited bandwidth
- Backend on Railway: $5/month credit, perfect for APIs
- Separate concerns: easier to manage
- Better performance: Vercel's CDN is optimized for static sites
- Professional setup: this is how most companies do it

**Cost:**
- Vercel: $0 (free forever for personal projects)
- Railway: $5 credit/month (enough for small API)
- **Total: Effectively FREE**

---

## Quick Start Commands

### For Vercel Deployment:

```bash
# 1. Update API URL in frontend
# Edit: frontend/src/environments/environment.prod.ts

# 2. Commit and push
git add .
git commit -m "feat: configure for Vercel deployment"
git push origin main

# 3. Go to vercel.com and import your repo
# Set root directory to: frontend
```

### For Railway Backend:

```bash
# 1. Generate APP_KEY
cd backend
php artisan key:generate --show

# 2. Copy the key
# 3. Add to Railway variables
# 4. Set root directory to: backend
# 5. Deploy
```

---

## Troubleshooting

### Railway still running frontend commands on backend:
- Make sure Root Directory is set to `backend`
- Check that `backend/nixpacks.toml` exists
- Try deleting the service and creating a new one

### Vercel build fails:
- Make sure Root Directory is set to `frontend`
- Check that `frontend/package.json` has build script
- Verify Output Directory is `dist/frontend/browser`

### Frontend can't connect to backend:
- Check API URL in `environment.prod.ts`
- Verify CORS settings in Railway backend
- Make sure backend URL includes `/api/v1`

### Backend 500 errors:
- Check Railway logs
- Verify APP_KEY is set
- Make sure database migrations ran
- Check if database file exists

---

## Success Checklist

- [ ] Backend deployed on Railway with root directory = `backend`
- [ ] Backend URL accessible and returns JSON
- [ ] Frontend environment.prod.ts updated with backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] Frontend deployed on Vercel with root directory = `frontend`
- [ ] Frontend loads and displays data
- [ ] Contact form works
- [ ] Admin login works
- [ ] CORS configured correctly

---

## Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Vercel: Add custom domain in project settings
   - Railway: Add custom domain in service settings

2. **Environment Variables**:
   - Keep them in sync if you change URLs

3. **Monitoring**:
   - Vercel: Check Analytics tab
   - Railway: Check Metrics tab

---

This approach is much simpler and more reliable than trying to deploy both from the same Railway service! 🚀
