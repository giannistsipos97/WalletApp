import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Transaction } from '../../models/Transaction';
import { EditBalanceModalComponent } from '../edit-balance-modal/edit-balance-modal.component';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, EditBalanceModalComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  headerService = inject(HeaderService);

  account = signal<Account | null>(null);
  transactions = signal<Transaction[]>([]);
  summary = signal<any | null>(null);
  showEditModal = signal(false);

  ngOnInit() {
    this.headerService.updateHeader(
      'Account Details',
      'View your activity and balance',
    );
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDetails(id);
    }
  }

  loadDetails(id: string) {
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
