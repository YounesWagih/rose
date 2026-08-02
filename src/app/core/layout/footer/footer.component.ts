import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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

  email = new FormControl('', [Validators.required, Validators.email]);
  message = signal('');

  subscribe() {
    if (this.email.invalid || !this.email.value) {
      this.email.markAsTouched();
      return;
    }

    this.subscriptionService.subscribe(this.email.value).subscribe({
      next: () => {
        this.message.set('Thank you for subscribing!');
        this.email.reset();
      },
      error: () => this.message.set('Subscription failed. Please try again.')
    });
  }
}
