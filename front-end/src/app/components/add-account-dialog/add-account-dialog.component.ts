import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-add-account-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-account-dialog.component.html',
})
export class AddAccountDialogComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  @Output() close = new EventEmitter<void>();

  colorPresets = [
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Indigo', class: 'bg-indigo-600' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Sky', class: 'bg-sky-500' },
    { name: 'Violet', class: 'bg-violet-600' },
    { name: 'Orange', class: 'bg-orange-500' },
  ];

  accountForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    balance: [0, [Validators.required, Validators.min(0)]],
    color: ['bg-emerald-600', Validators.required],
  });

  onSubmit() {
    if (this.accountForm.valid) {
      const newAccount = this.accountForm.value as Account;

      this.accountService.createAccount(newAccount).subscribe({
        next: () => {
          this.close.emit();
        },
        error: (err) => console.error('Create account failed', err),
      });
    }
  }
}
