import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  title = signal<string>('Dashboard');
  subtitle = signal<string>('Welcome back');
  isDrawerOpen = signal<boolean>(false);

  updateHeader(title: string, subtitle: string = '') {
    this.title.set(title);
    this.subtitle.set(subtitle);
  }

  toggleDrawer() {
    this.isDrawerOpen.update((prev) => !prev);
  }
}
