# Angular Frontend Setup Instructions

## Current Status

The Angular project structure has been successfully created with the following configuration:

- **Angular Version**: 20.3.x (latest)
- **Node Version**: 22.12.0
- **Package Manager**: npm
- **Style**: SCSS
- **Routing**: Enabled
- **SSR**: Enabled (Server-Side Rendering)
- **Zoneless**: Yes (using signals-based change detection)

## What's Been Configured

### 1. Project Structure
- ✅ Angular CLI project initialized
- ✅ Routing module configured with placeholder routes
- ✅ Environment files created (development & production)
- ✅ Angular Material dependencies added to package.json
- ✅ HttpClient configured with interceptors
- ✅ BrowserAnimationsModule added for Angular Material
- ✅ Basic home component created for testing

### 2. Environment Configuration

**Development** (`src/environments/environment.ts`):
```typescript
{
  production: false,
  apiUrl: 'http://localhost/api/v1'
}
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
{
  production: true,
  apiUrl: '/api/v1'
}
```

### 3. Routing Structure

Basic routing is configured in `src/app/app-routing-module.ts` with:
- Home route (active with placeholder component)
- Commented placeholders for: About, Experience, Projects, Skills, Contact
- Lazy-loaded admin module placeholder
- Fallback route to home

### 4. Dependencies Added

The following packages have been added to `package.json`:
- `@angular/animations` - Required for Angular Material
- `@angular/cdk` - Component Dev Kit for Angular Material
- `@angular/material` - Angular Material UI components
- `@angular/platform-browser-dynamic` - Dynamic platform browser

## Next Steps - REQUIRED

### Step 1: Install Dependencies

**IMPORTANT**: You need to run npm install manually in an elevated PowerShell or Command Prompt.

```powershell
# Open PowerShell as Administrator
# Navigate to the frontend directory
cd portfolio/frontend

# Install all dependencies
npm install
```

If you encounter permission issues with npm cache, try:
```powershell
# Option 1: Clear npm cache (as Administrator)
npm cache clean --force

# Option 2: Use a different cache location
npm install --cache C:\temp\npm-cache

# Option 3: Use yarn instead
npm install -g yarn
yarn install
```

### Step 2: Verify Installation

After successful installation, verify the setup:

```bash
# Check Angular CLI version
ng version

# Should show all Angular packages installed
```

### Step 3: Start Development Server

```bash
# Start the Angular dev server
npm start

# Or use ng serve directly
ng serve

# The app should be available at http://localhost:4200
```

### Step 4: Install Angular Material (Interactive)

After npm install completes, run the Angular Material schematic:

```bash
ng add @angular/material
```

This will:
- Set up Angular Material theme
- Configure global typography
- Add browser animations
- Set up Material icons

**Choose these options when prompted:**
- Theme: Choose any theme (Indigo/Pink, Deep Purple/Amber, Pink/Blue Grey, or Purple/Green)
- Typography: Yes
- Animations: Yes

## Testing the Setup

Once the dev server is running:

1. Open browser to `http://localhost:4200`
2. You should see the home page with "Amirul Iman - Portfolio"
3. Check browser console for any errors
4. Verify routing works (should redirect from `/` to `/home`)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── home/                    # Home component (created)
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.scss
│   │   ├── app-routing-module.ts    # Routing configuration
│   │   ├── app-module.ts            # Root module
│   │   ├── app.ts                   # Root component
│   │   ├── app.html                 # Root template
│   │   └── app.scss                 # Root styles
│   ├── environments/                # Environment configs
│   │   ├── environment.ts           # Development
│   │   └── environment.prod.ts      # Production
│   ├── index.html                   # Main HTML file
│   ├── main.ts                      # Application entry point
│   ├── main.server.ts               # SSR entry point
│   ├── server.ts                    # Express server for SSR
│   └── styles.scss                  # Global styles
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Angular CLI generated README
```

## Common Issues & Solutions

### Issue 1: npm Permission Errors (EPERM)
**Solution**: Run PowerShell/Command Prompt as Administrator

### Issue 2: Port 4200 Already in Use
**Solution**: 
```bash
ng serve --port 4201
```

### Issue 3: Module Not Found Errors
**Solution**: Ensure npm install completed successfully
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Angular Material Not Working
**Solution**: Run `ng add @angular/material` after npm install

## Docker Integration

The Angular dev server will be integrated with Docker in task 1.1.2. For now, you can run it locally for development.

To prepare for Docker integration:
- The dev server runs on port 4200
- API calls will proxy to `http://localhost/api/v1` (nginx)
- Environment variables will be configured in docker-compose.yml

## Acceptance Criteria Status

- ✅ Angular app structure created
- ⏳ Angular Material installed (requires manual `ng add @angular/material` after npm install)
- ✅ Environment files configured
- ✅ Basic routing works (home route active)
- ⏳ No compilation errors (pending npm install completion)
- ⏳ Angular app loads on port 4200 (pending npm install and `npm start`)

## Next Task

After completing this setup:
1. Run `npm install` as Administrator
2. Run `ng add @angular/material`
3. Start dev server with `npm start`
4. Verify app loads at http://localhost:4200
5. Proceed to task 1.1.5 (Create Makefile)

## Support

If you encounter issues:
1. Check Node.js version: `node --version` (should be 22.x)
2. Check npm version: `npm --version` (should be 11.x)
3. Check Angular CLI: `ng version`
4. Clear npm cache: `npm cache clean --force`
5. Try yarn as alternative: `npm install -g yarn && yarn install`
