import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSectionComponent {
  @Input() destination = '#popular';

  readonly features = [
    'Streamlined Shipping Experience',
    'Affordable Modern Design',
    'Competitive Price & Easy To Shop',
    'We Made Awesome Products',
  ];
}
