import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-popup',
  imports: [ReactiveFormsModule],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPopupComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  @Output() readonly closed = new EventEmitter<void>();

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: false,
  });

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  submit(): void {
    this.submitError.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { email, password, remember } = this.form.getRawValue();

    this.authService
      .login({ email: email.trim(), password }, remember)
      .subscribe({
        next: () => this.close(),
        error: () => {
          this.isSubmitting.set(false);
          this.submitError.set('Email or password is incorrect.');
        }
      });
  }

  close(): void {
    this.closed.emit();
  }
}
