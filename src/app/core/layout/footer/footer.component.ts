import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-footer',
  imports: [ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private subscriptionService = inject(SubscriptionService);

  subscriptionForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });
  message = signal('');

  get email() {
    return this.subscriptionForm.controls.email;
  }

  subscribe() {
    if (this.email.invalid || !this.email.value) {
      this.email.markAsTouched();
      return;
    }

    this.subscriptionService.subscribe(this.email.value).subscribe({
      next: (response) => {
        this.message.set(response.message);
        this.email.reset();
      },
      error: () => this.message.set('Subscription failed. Please try again.')
    });
  }
}
