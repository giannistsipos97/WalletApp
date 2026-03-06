import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  // Signals for easy state management
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('wallet_token'));

  signUp(userData: any) {
    return this.http
      .post<any>(`${this.apiUrl}/signup`, userData)
      .pipe(tap((response) => this.saveSession(response)));
  }

  login(credentials: any) {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response) => this.saveSession(response)));
  }

  private saveSession(response: any) {
    localStorage.setItem('wallet_token', response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('wallet_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    window.location.reload(); // Quick way to clear app state
  }
}
