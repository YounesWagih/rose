import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-benefits-section',
  templateUrl: './benefits-section.component.html',
  styleUrl: './benefits-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitsSectionComponent {
  readonly benefits = [
    {
      title: 'Free Delivery',
      description: 'Orders Over $120',
      icon: 'assets/home/delivery.svg',
    },
    {
      title: 'Get Refund',
      description: 'Within 30 Days Returns',
      icon: 'assets/home/refund.svg',
    },
    {
      title: 'Safe Payment',
      description: '100% Secure Payment',
      icon: 'assets/home/payment.svg',
    },
    {
      title: '24/7 Support',
      description: 'Feel Free To Call Us',
      icon: 'assets/home/support.svg',
    },
  ];
}
