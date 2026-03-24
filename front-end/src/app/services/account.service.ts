import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account } from '../models/Account';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/accounts';

  private accountsSubject = new BehaviorSubject<Account[]>([]);

  accounts$ = this.accountsSubject.asObservable();

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl).pipe(
      tap((accounts: Account[]) => {
        this.accountsSubject.next(accounts);
      }),
    );
  }

  createAccount(accountData: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, accountData).pipe(
      tap(() => {
        this.getAccounts().subscribe();
      }),
    );
  }

  // Helper to get the current value without an async subscription
  get currentAccountsValue() {
    return this.accountsSubject.value;
  }
}
