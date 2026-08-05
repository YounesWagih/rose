import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-trusted-section',
  imports: [CarouselModule, RouterLink],
  templateUrl: './trusted-section.component.html',
  styleUrl: './trusted-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedSectionComponent {
  readonly companies = [1, 2, 3, 4, 5, 6];

  readonly carouselOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: false,

    autoplay: true,
    autoplayHoverPause: false,

    autoplaySpeed: 3000,
    autoplayTimeout: 3001,
    smartSpeed: 3000,
    slideTransition: 'linear',

    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,

    responsive: {
      0: { items: 2, margin: 16 },
      480: { items: 3, margin: 24 },
      768: { items: 4, margin: 40 },
      1024: { items: 5, margin: 56 },
    },
  };
}
