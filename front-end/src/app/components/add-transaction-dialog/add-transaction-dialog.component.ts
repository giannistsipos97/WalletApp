import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../../models/Account';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-transaction-dialog.component.html',
})
export class AddTransactionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);

  @Input({ required: true }) account!: Account;
  @Input({ required: true }) type: 'income' | 'expense' = 'expense';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  transactionForm = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    category: ['General', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        console.log(this.categories());
      },
      error: (err) => {
        console.error('Error fetching categories in component:', err);
      },
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transactionData = {
        ...this.transactionForm.value,
        accountId: this.account._id,
        type: this.type,
      };
      console.log('Saving Transaction:', transactionData);
      this.saved.emit(transactionData);
      this.close.emit();
    }
  }
}
