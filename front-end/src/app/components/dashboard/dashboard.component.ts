import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { ThemeService } from '../../services/theme.service.spec';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  userProfile = signal<User | null>(null);

  // Use a computed signal: it watches userProfile and updates automatically
  avatarLetters = computed(() => {
    const user = this.userProfile();

    // FIX: Changed user.fullName to user.name
    if (!user || !user.name) return '??';

    const names = user.name.trim().split(/\s+/);
    const firstLetter = names[0]?.charAt(0).toUpperCase() || '';
    const secondLetter = names[1]?.charAt(0).toUpperCase() || '';

    return firstLetter + secondLetter;
  });

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        if (err.status === 401) this.authService.logout();
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
