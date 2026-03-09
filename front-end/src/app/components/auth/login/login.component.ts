import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  handleLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login({ email: this.email(), password: this.password() })
      .subscribe({
        next: (res) => {
          // Save the token so the user stays logged in
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err.error?.message || 'Invalid email or password',
          );
        },
      });
  }
}
