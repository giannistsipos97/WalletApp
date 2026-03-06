import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
// Import your new components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  // Make sure to add the components here!
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  public themeService = inject(ThemeService);

  // Possible views: 'welcome', 'login', 'register'
  view: 'welcome' | 'login' | 'register' = 'welcome';

  showLogin() {
    this.view = 'login';
  }
  showRegister() {
    this.view = 'register';
  }
  showWelcome() {
    this.view = 'welcome';
  }
}
