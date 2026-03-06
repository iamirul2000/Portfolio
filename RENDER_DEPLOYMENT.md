# Deploy to Render (Easier Alternative to Railway)

## Why Render Instead of Railway?

Railway is having issues with your PHP/Composer setup. Render is actually EASIER for Laravel:

- ✅ Better PHP support
- ✅ Free tier available
- ✅ Simpler configuration
- ✅ PostgreSQL database included (or use SQLite)
- ✅ Auto-deploy from GitHub

---

## Step 1: Deploy Backend on Render

### 1. Go to Render

Visit: [render.com](https://render.com)

### 2. Sign Up

- Click "Get Started"
- Sign up with GitHub

### 3. Create New Web Service

- Click "New +" → "Web Service"
- Connect your GitHub account
- Select your `Portfolio` repository

### 4. Configure Service

Fill in these settings:

**Basic Settings:**
- **Name:** `portfolio-backend` (or any name you like)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `PHP`
- **Build Command:**
  ```bash
  composer install --no-dev --optimize-autoloader && touch database/database.sqlite && php artisan migrate --force && php artisan db:seed --force
  ```
- **Start Command:**
  ```bash
  php artisan serve --host=0.0.0.0 --port=$PORT
  ```

**Instance Type:**
- Select **Free** (this is important!)

### 5. Add Environment Variables

Click "Advanced" and add these:

```
APP_NAME=Portfolio
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_HERE
APP_URL=https://portfolio-backend.onrender.com

DB_CONNECTION=sqlite
DB_DATABASE=/opt/render/project/src/database/database.sqlite

CORS_ALLOWED_ORIGINS=*

MAIL_MAILER=log
```

**Generate APP_KEY locally:**
```bash
cd backend
php artisan key:generate --show
```
Copy the output and paste as `APP_KEY` value.

### 6. Deploy!

- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- You'll get a URL like: `https://portfolio-backend.onrender.com`

### 7. Test Backend

Visit: `https://your-backend-url.onrender.com/api/v1/profile`

Should return JSON with profile data.

---

## Step 2: Deploy Frontend on Vercel

### 1. Update Frontend API URL

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com/api/v1'
};
```

Replace with your actual Render backend URL.

### 2. Commit Changes

```bash
git add .
git commit -m "feat: configure for Render backend"
git push origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your `Portfolio` repository
5. Configure:
   - **Framework Preset:** Angular
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser`
6. Click "Deploy"

### 4. Update Backend CORS

Once Vercel gives you a URL:

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
5. Save (Render will auto-redeploy)

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month (enough for one service)
- Good for portfolio/demo projects

**Vercel Free Tier:**
- Unlimited bandwidth
- No cold starts
- Perfect for frontend

### Cold Start Solution

If you want to keep backend awake, use a service like:
- [UptimeRobot](https://uptimerobot.com) (free)
- Ping your backend URL every 10 minutes

---

## Troubleshooting

### Build Fails on Render

**Check PHP Version:**
- Render uses PHP 8.1 by default
- Add `.php-version` file in backend directory:
  ```
  8.2
  ```

**Composer Issues:**
- Add `--no-scripts` flag to build command
- Use `--ignore-platform-reqs` if needed

### Database Issues

**SQLite Path:**
- Use absolute path: `/opt/render/project/src/database/database.sqlite`
- Make sure `touch database/database.sqlite` runs in build command

**Migrations Fail:**
- Check Render logs
- Verify database file is created
- Try running migrations manually in Render shell

### CORS Errors

**Update CORS:**
- Make sure `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Use `*` for testing (not recommended for production)

---

## Alternative: Render for Both Frontend and Backend

You can also deploy frontend on Render:

### Frontend on Render:

**Settings:**
- **Runtime:** Static Site
- **Build Command:** `npm run build`
- **Publish Directory:** `dist/frontend/browser`

**Pros:**
- Everything in one place
- Easier to manage

**Cons:**
- Vercel is faster for frontend (better CDN)
- Vercel has better Angular support

---

## Comparison: Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | ✅ Yes | ✅ $5 credit/month |
| PHP Support | ✅ Excellent | ⚠️ Complex setup |
| Cold Starts | ⚠️ Yes (free tier) | ✅ No |
| Setup Difficulty | ✅ Easy | ⚠️ Medium |
| Database | ✅ PostgreSQL included | ⚠️ Manual setup |

---

## Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL accessible
- [ ] API returns JSON data
- [ ] Frontend environment.prod.ts updated
- [ ] Changes committed and pushed
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads and displays data
- [ ] CORS configured correctly
- [ ] Contact form works
- [ ] Admin login works

---

## Next Steps

After successful deployment:

1. **Custom Domain:**
   - Render: Add in service settings
   - Vercel: Add in project settings

2. **Keep Backend Awake:**
   - Use UptimeRobot to ping every 10 minutes
   - Or upgrade to Render paid plan ($7/month)

3. **Monitoring:**
   - Check Render logs for errors
   - Monitor Vercel analytics

---

This approach is much more reliable than Railway for Laravel! 🚀
