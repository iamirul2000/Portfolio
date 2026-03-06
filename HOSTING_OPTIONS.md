# Free Hosting Options for Portfolio App

## Overview
Your portfolio consists of:
- **Frontend**: Angular 19 application
- **Backend**: Laravel 11 API with SQLite database
- **Full Stack**: Both need to be hosted together

---

## 🌟 Recommended: Railway (Best for Full Stack)

**Why Railway?**
- Free tier: $5 credit/month (enough for small apps)
- Supports both Laravel backend + Angular frontend
- Easy deployment from GitHub
- Automatic HTTPS
- Database included

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your portfolio repository
5. Railway will auto-detect Laravel and deploy it
6. Add environment variables in Railway dashboard
7. Deploy frontend separately or serve from Laravel

**Pros:** Easy setup, full stack support, automatic deployments
**Cons:** Limited free credits ($5/month)

---

## 🚀 Alternative Options

### 1. Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
- Unlimited free hosting for static sites
- Perfect for Angular apps
- Automatic deployments from GitHub
- Custom domains
- Global CDN

**Setup:**
```bash
# In frontend directory
ng build --configuration production
```

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist/frontend/browser`
6. Deploy!

**Backend on Railway/Render:** (see Railway above or Render below)

---

### 2. Netlify (Frontend) + Render (Backend)

**Frontend on Netlify:**
- Free tier with 100GB bandwidth
- Automatic deployments
- Custom domains
- Forms and serverless functions

**Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `dist/frontend/browser`

**Backend on Render:**
- Free tier available (spins down after inactivity)
- PostgreSQL database included
- Auto-deploy from GitHub

**Setup:**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root directory: `backend`
5. Build command: `composer install`
6. Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

---

### 3. GitHub Pages (Frontend Only - Static)

**Best for:** Portfolio showcase without backend features

**Setup:**
```bash
cd frontend
ng build --configuration production --base-href /Portfolio/
```

1. Install angular-cli-ghpages: `npm install -g angular-cli-ghpages`
2. Deploy: `npx angular-cli-ghpages --dir=dist/frontend/browser`
3. Enable GitHub Pages in repo settings

**Note:** Admin features won't work without backend

---

### 4. Heroku (Full Stack)

**Status:** No longer free, but affordable ($5-7/month)

**Setup:**
1. Create Heroku account
2. Install Heroku CLI
3. Create two apps: one for backend, one for frontend
4. Deploy using Git

---

## 📋 Deployment Checklist

### Before Deploying:

**Backend:**
- [ ] Set `APP_ENV=production` in environment variables
- [ ] Generate new `APP_KEY`: `php artisan key:generate`
- [ ] Set `APP_URL` to your backend domain
- [ ] Configure CORS for frontend domain
- [ ] Set database connection (SQLite or PostgreSQL)
- [ ] Set mail configuration for contact form
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed database: `php artisan db:seed --force`

**Frontend:**
- [ ] Update API URL in `environment.prod.ts`
- [ ] Build for production: `ng build --configuration production`
- [ ] Test build locally: `cd dist/frontend/browser && npx http-server`
- [ ] Verify all API calls work with production backend

---

## 🎯 My Recommendation

**For Your Portfolio:**

### Option 1: Railway (Easiest)
Deploy everything on Railway - simple, works out of the box, $5/month credit is enough.

### Option 2: Vercel + Railway (Best Performance)
- **Frontend on Vercel** (free, fast CDN)
- **Backend on Railway** (free tier)
- Update frontend API URL to point to Railway backend

### Option 3: Netlify + Render (Most Popular)
- **Frontend on Netlify** (free)
- **Backend on Render** (free tier, but slower cold starts)

---

## 🔧 Quick Deploy Commands

### Build Frontend for Production:
```bash
cd frontend
npm run build
```

### Build Backend for Production:
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🌐 Environment Variables Needed

### Backend (.env):
```env
APP_NAME="Your Portfolio"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-backend-domain.com

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Frontend (environment.prod.ts):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api/v1'
};
```

---

## 📞 Need Help?

After choosing a hosting option, I can help you:
1. Configure environment variables
2. Set up deployment scripts
3. Fix any deployment issues
4. Configure custom domains

Let me know which option you'd like to use!
