import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Transaction } from '../../models/Transaction';
import { EditBalanceModalComponent } from '../edit-balance-modal/edit-balance-modal.component';
import { HeaderService } from '../../services/header.service';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    EditBalanceModalComponent,
    EditTransactionComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  headerService = inject(HeaderService);
  categoriesService = inject(CategoryService);
  transactionService = inject(TransactionService); // Assuming transactions are managed by AccountService for simplicity

  account = signal<Account | null>(null);
  transactions = signal<Transaction[]>([]);
  summary = signal<any | null>(null);
  showEditModal = signal(false);
  editTransaction = signal<Transaction | null>(null);
  allCategories = signal<Category[]>([]);

  ngOnInit() {
    this.headerService.updateHeader(
      'Account Details',
      'View your activity and balance',
    );
    this.categoriesService.getCategories().subscribe((categories) => {
      this.allCategories.set(categories);
    });
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

  loadTransactions(accountId: string) {
    this.transactionService
      .getAccountTransactions(accountId)
      .subscribe((transactions) => {
        this.transactions.set(transactions);
      });
  }

  handleBalanceUpdate(account: Account) {
    this.showEditModal.set(false);
    this.account.set(account);
  }

  openEditTransaction(transaction: any) {
    this.editTransaction.set(transaction);
  }

  handleUpdate(updatedData: any) {
    this.editTransaction.set(null);
    this.loadDetails(updatedData.account._id);
    // this.loadTransactions(updatedData.account._id);
  }
}
