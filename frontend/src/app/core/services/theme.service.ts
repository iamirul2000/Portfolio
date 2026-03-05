import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  
  // Signal for reactive theme state - locked to dark mode
  theme = signal<Theme>('dark');

  constructor() {
    // Apply dark theme on initialization
    effect(() => {
      this.applyTheme('dark');
    });
  }

  // Disabled - theme is locked to dark mode
  toggleTheme(): void {
    // Theme toggle disabled - always dark mode
    console.log('Theme toggle is disabled. Portfolio uses dark mode only.');
  }

  // Disabled - theme is locked to dark mode
  setTheme(theme: Theme): void {
    // Theme setting disabled - always dark mode
    console.log('Theme setting is disabled. Portfolio uses dark mode only.');
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Remove existing theme class
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add dark theme class
    root.classList.add('dark-theme');
    
    // Store dark theme preference
    localStorage.setItem(this.THEME_KEY, 'dark');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0a0e1a');
    }
  }
}
