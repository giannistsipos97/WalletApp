import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/Transaction';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-view-all-transactions',
  standalone: true,
  imports: [CommonModule, TransactionListComponent],
  templateUrl: './view-all-transactions.component.html',
  styleUrl: './view-all-transactions.component.scss',
})
export class ViewAllTransactionsComponent {
  @Input() transactions: Transaction[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() editTransaction = new EventEmitter<Transaction>();

  onEdit(tx: Transaction) {
    this.editTransaction.emit(tx);
    // this.close.emit();
  }
}
