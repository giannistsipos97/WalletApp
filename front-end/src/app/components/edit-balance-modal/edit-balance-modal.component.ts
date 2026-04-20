import {
  Component,
  input,
  output,
  inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-edit-balance-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-balance-modal.component.html',
})
export class EditBalanceModalComponent implements OnInit {
  accountService = inject(AccountService);

  @Input() account!: Account;
  @Output() close = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<Account>();

  balanceControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit() {
    this.balanceControl.setValue(this.account.balance);
  }

  save() {
    if (this.balanceControl.valid) {
      this.accountService
        .updateBalance(this.account._id!, this.balanceControl.value)
        .subscribe((res) => {
          this.updated.emit(res);
        });
    }
  }
}
