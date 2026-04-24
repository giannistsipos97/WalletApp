import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/Transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() limit?: number;
  @Output() edit = new EventEmitter<Transaction>();

  get displayedTransactions() {
    return this.limit
      ? this.transactions.slice(0, this.limit)
      : this.transactions;
  }
}
