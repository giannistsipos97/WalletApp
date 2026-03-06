import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Signal to track theme state
  darkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.darkMode.set(!this.darkMode());
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
