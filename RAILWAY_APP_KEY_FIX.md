# Fix Railway 500 Error - Missing APP_KEY

## The Problem

Your app deployed successfully but shows "500 SERVER ERROR" because the `APP_KEY` environment variable is missing.

The error in logs:
```
production.ERROR: No application encryption key has been specified.
```

---

## ✅ Quick Fix - Add APP_KEY to Railway

### Step 1: Generate APP_KEY

Use this pre-generated key (safe for your portfolio):

```
base64:8N5xJ2kP9mL4qR7sT6uV8wX0yZ1aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5y
```

**OR** generate your own:

You can use any online Laravel key generator, or use this PHP code:
```php
<?php
echo 'base64:' . base64_encode(random_bytes(32));
```

### Step 2: Add to Railway Environment Variables

1. Go to your Railway dashboard
2. Click on your **Portfolio** service
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Variable Name:** `APP_KEY`
   - **Value:** `base64:8N5xJ2kP9mL4qR7sT6uV8wX0yZ1aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5y`
6. Click **"Add"**

### Step 3: Add Other Missing Variables

While you're there, make sure you have ALL these variables:

```
APP_NAME=Portfolio
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:8N5xJ2kP9mL4qR7sT6uV8wX0yZ1aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5y
APP_URL=https://myportfolio-mirul.up.railway.app

DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

CORS_ALLOWED_ORIGINS=*

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@portfolio.com
MAIL_FROM_NAME=Portfolio
```

**Important:** Update `APP_URL` with your actual Railway URL!

### Step 4: Redeploy

Railway will automatically redeploy when you save the variables.

Wait 2-3 minutes, then visit your URL again.

---

## ✅ Verify It Works

Visit: `https://myportfolio-mirul.up.railway.app/api/v1/profile`

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

---

## If Still Getting 500 Error

### Check Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Check **"Deploy Logs"** for errors

### Common Issues:

**Database not created:**
- Make sure migrations ran during build
- Check if `database/database.sqlite` exists

**Permissions:**
- SQLite database needs write permissions
- Railway should handle this automatically

**Cache issues:**
- Try adding this to your build command:
  ```bash
  php artisan config:clear && php artisan cache:clear
  ```

---

## Alternative: Use .env File (Not Recommended for Production)

If Railway variables aren't working, you can commit a `.env` file:

1. Copy `backend/.env.example` to `backend/.env`
2. Add the APP_KEY
3. Commit and push

**Warning:** This is not secure for production! Use environment variables instead.

---

## Success!

Once APP_KEY is added, your backend should work perfectly! 🚀

Then you can deploy the frontend on Vercel and connect them together.
