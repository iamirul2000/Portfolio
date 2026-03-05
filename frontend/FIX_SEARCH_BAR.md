# Fix Search Bar Display Issue

The search bar is showing as a white box because of browser caching. Follow these steps:

## Step 1: Stop Angular Dev Server
Press `Ctrl+C` in the terminal where Angular is running

## Step 2: Clear Angular Cache
```powershell
cd portfolio/frontend
Remove-Item -Recurse -Force .angular
```

## Step 3: Clear Browser Cache
In your browser:
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"

OR simply do a hard refresh:
- Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

## Step 4: Restart Angular
```powershell
ng serve
```

## Step 5: Open in Incognito/Private Window
To test without cache:
- Chrome: `Ctrl+Shift+N`
- Firefox: `Ctrl+Shift+P`
- Edge: `Ctrl+Shift+N`

Navigate to `http://localhost:4200/projects`

## What Should You See?
- Search field with search icon on the left
- Technology dropdown with filter icon on the left
- All/Featured toggle buttons on the right
- Proper Material Design styling (outlined fields with labels)

## If Still Not Working
The changes are definitely in the code. Try:
1. Close ALL browser tabs with localhost:4200
2. Clear cache again
3. Restart Angular
4. Open in incognito mode

## Quick Restart Script
Run this PowerShell script:
```powershell
./restart-clean.ps1
```

This will:
- Kill all Node processes
- Clear Angular cache
- Restart the dev server
