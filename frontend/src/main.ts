import 'zone.js';
import { platformBrowser } from '@angular/platform-browser';
import { inject } from '@vercel/analytics';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule)
  .then(() => {
    // Initialize Vercel Analytics after app bootstrap
    inject();
  })
  .catch(err => console.error(err));
