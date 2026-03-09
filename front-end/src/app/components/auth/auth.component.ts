import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
// Import your new components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  // Make sure to add the components here!
  imports: [CommonModule, LoginComponent, RegisterComponent, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public themeService = inject(ThemeService);

  private router = inject(Router);

  // We check the URL to decide if we should show the "Welcome" buttons
  // or just show the nested route (Login/Register)
  isWelcomePage(): boolean {
    return this.router.url === '/auth';
  }

  navigateTo(path: string) {
    this.router.navigate([`/auth/${path}`]);
  }
}
