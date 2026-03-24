import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { ThemeService } from '../../services/theme.service.spec';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/Account';
import { AddAccountDialogComponent } from '../add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddAccountDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  accountService = inject(AccountService);

  userProfile = signal<User | null>(null);
  selectedAccount = signal<Account | null>(null);
  isModalOpen = signal(false);

  // Computed signal: it watches userProfile and updates automatically
  avatarLetters = computed(() => {
    const user = this.userProfile();

    if (!user || !user.name) return '??';

    const names = user.name.trim().split(/\s+/);
    const firstLetter = names[0]?.charAt(0).toUpperCase() || '';
    const secondLetter = names[1]?.charAt(0).toUpperCase() || '';

    return firstLetter + secondLetter;
  });

  ngOnInit() {
    this.getUserProfile();
    this.loadAccounts();
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

  loadAccounts() {
    this.accountService.getAccounts().subscribe((accounts) => {
      if (accounts.length > 0 && !this.selectedAccount()) {
        this.selectedAccount.set(accounts[0]);
      }
    });
  }

  openAddAccountDialog() {
    this.isModalOpen.set(true);
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
