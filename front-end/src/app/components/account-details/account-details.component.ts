import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Transaction } from '../../models/Transaction';
import { EditBalanceModalComponent } from '../edit-balance-modal/edit-balance-modal.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe, // 2. Add DecimalPipe here for the 'number' pipe
    DatePipe,
    EditBalanceModalComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  accountService = inject(AccountService);

  account = signal<Account | null>(null);
  transactions = signal<Transaction[]>([]);
  summary = signal<any | null>(null);
  showEditModal = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetails(id);
    }
  }

  loadDetails(id: string) {
    // You'll need to create this method in your service
    this.accountService.getAccountById(id).subscribe((data) => {
      this.account.set(data.account);
      this.transactions.set(data.transactions);
      this.summary.set(data.summary);
    });
  }

  handleBalanceUpdate(account: Account) {
    this.showEditModal.set(false);
    this.account.set(account);
  }
}
