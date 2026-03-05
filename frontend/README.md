# Portfolio Frontend - Angular Application

This is the frontend application for Amirul Iman's portfolio, built with Angular 20.x.

## Quick Start

### Prerequisites
- Node.js 22.x or higher
- npm 11.x or higher
- Angular CLI 20.x (already installed globally)

### Installation

1. **Install dependencies** (run as Administrator):
   ```bash
   npm install
   ```

2. **Install Angular Material**:
   ```bash
   # Option 1: Use the PowerShell script
   .\install-material.ps1

   # Option 2: Run manually
   ng add @angular/material
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open browser**:
   Navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start development server on port 4200
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run serve:ssr:portfolio-app` - Run SSR server

## Project Configuration

### Environment Files
- `src/environments/environment.ts` - Development configuration
- `src/environments/environment.prod.ts` - Production configuration

### API Configuration
- Development API: `http://localhost/api/v1`
- Production API: `/api/v1`

### Features Configured
- ✅ Angular Material (UI components)
- ✅ Routing (with lazy loading support)
- ✅ HttpClient (with interceptors)
- ✅ Server-Side Rendering (SSR)
- ✅ Zoneless change detection (signals-based)
- ✅ SCSS styling
- ✅ Environment-based configuration

## Project Structure

```
src/
├── app/
│   ├── home/              # Home page component
│   ├── app-routing-module.ts
│   ├── app-module.ts
│   ├── app.ts
│   ├── app.html
│   └── app.scss
├── environments/          # Environment configurations
├── index.html
├── main.ts
├── main.server.ts
├── server.ts
└── styles.scss
```

## Development Workflow

1. Make changes to components/services
2. Angular dev server auto-reloads
3. Test in browser at http://localhost:4200
4. Build for production: `npm run build`

## Troubleshooting

### npm install fails with EPERM error
**Solution**: Run PowerShell/Command Prompt as Administrator

### Port 4200 already in use
**Solution**: 
```bash
ng serve --port 4201
```

### Module not found errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After setup is complete:
1. Implement public pages (Home, About, Experience, Projects, Skills, Contact)
2. Implement admin panel (Dashboard, CRUD interfaces)
3. Integrate with Laravel backend API
4. Add Angular Material components
5. Implement responsive design

## Documentation

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Project Requirements](../../.kiro/specs/portfolio/requirements.md)
- [Technical Design](../../.kiro/specs/portfolio/design.md)
- [Setup Instructions](./SETUP.md)

## Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)
