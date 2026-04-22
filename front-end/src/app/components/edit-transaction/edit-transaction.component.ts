import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.scss',
})
export class EditTransactionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  @Input() transaction: any;
  @Input() categories: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  isReadOnly = signal(true);

  editForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    const formattedDate = new Date(this.transaction.date)
      .toISOString()
      .split('T')[0];

    this.editForm = this.fb.group({
      description: [this.transaction.description, Validators.required],
      amount: [
        this.transaction.amount,
        [Validators.required, Validators.min(0.01)],
      ],
      date: [formattedDate, Validators.required],
      category: [
        this.transaction.category._id || this.transaction.category,
        Validators.required,
      ],
      type: [this.transaction.type],
    });
    this.editForm.disable();
  }

  toggleEdit() {
    this.isReadOnly.set(!this.isReadOnly());
    if (this.isReadOnly()) {
      this.editForm.disable();
    } else {
      this.editForm.enable();
    }
  }

  onSave() {
    if (this.editForm.valid) {
      this.transactionService
        .updateTransaction(this.transaction._id, this.editForm.value)
        .subscribe((res) => {
          console.log('Transaction updated successfully:', res);

          this.save.emit(res);
        });
    }
  }
}
