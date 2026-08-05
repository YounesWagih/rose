import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AboutSectionComponent } from '../../../../shared/components/about-section/about-section.component';
import { BenefitsSectionComponent } from '../../../../shared/components/benefits-section/benefits-section.component';
import { ReviewsSectionComponent } from '../../../../shared/components/reviews-section/reviews-section.component';
import { TrustedSectionComponent } from '../../../../shared/components/trusted-section/trusted-section.component';

@Component({
  selector: 'app-about',
  imports: [
    AboutSectionComponent,
    ReviewsSectionComponent,
    BenefitsSectionComponent,
    TrustedSectionComponent,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  readonly teamMembers = [
    {
      name: 'Ahmed Mohamed',
      role: 'Senior Manager',
      image: 'assets/team/1.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Senior Manager',
      image: 'assets/team/2.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Senior Manager',
      image: 'assets/team/3.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Senior Manager',
      image: 'assets/team/4.png',
    },
  ];

  readonly socialLinks = [
    { label: 'Facebook', icon: 'assets/social-media/facebook.svg' },
    { label: 'Instagram', icon: 'assets/social-media/instagram.svg' },
    { label: 'Twitter', icon: 'assets/social-media/twitter.svg' },
    { label: 'YouTube', icon: 'assets/social-media/youtube.svg' },
  ];

  readonly instagramImages = [
    'assets/home/gallery/gallery-1.png',
    'assets/home/gallery/gallery-2.png',
    'assets/home/gallery/gallery-3.jpg',
    'assets/home/gallery/gallery-4.png',
    'assets/home/gallery/gallery-5.png',
  ];
}
