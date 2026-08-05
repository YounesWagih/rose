import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-reviews-section',
  imports: [CarouselModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsSectionComponent {
  private readonly prefersReducedMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;
  readonly reviews = [
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-1.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-2.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-3.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-4.png',
    },
  ];
  readonly carouselOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    smartSpeed: 500,
    slideBy: 1,
    dotsEach: 1,
    margin: 24,
    responsive: {
      0: { items: 1, margin: 16 },
      600: { items: 2, margin: 24 },
      1050: { items: 4, margin: 24 },
    },
    autoplay: !this.prefersReducedMotion,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  };

  pauseAutoplay(carousel: CarouselComponent) {
    carousel.stopAutoplay();
  }
  resumeAutoplay(carousel: CarouselComponent) {
    if (!this.prefersReducedMotion) carousel.startAutoplay();
  }
}
