import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { LoginPopupService } from '../../../features/auth/services/login-popup.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  private readonly loginPopup = inject(LoginPopupService);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('firstMenuLink') private firstMenuLink?: ElementRef<HTMLAnchorElement>;

  readonly isMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);

  openLogin(): void {
    this.closeMenus();
    this.loginPopup.open();
  }

  toggleMenu(): void {
    this.isUserMenuOpen.set(false);

    if (this.isMenuOpen()) {
      this.closeMenu(true);
      return;
    }

    this.isMenuOpen.set(true);
    this.renderer.addClass(this.document.body, 'mobile-navigation-open');
    queueMicrotask(() => this.firstMenuLink?.nativeElement.focus());
  }

  toggleUserMenu(): void {
    this.closeMenu();
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenus(): void {
    this.closeMenu();
    this.isUserMenuOpen.set(false);
  }

  closeMenu(restoreFocus = false): void {
    const wasOpen = this.isMenuOpen();
    this.isMenuOpen.set(false);
    this.renderer.removeClass(this.document.body, 'mobile-navigation-open');

    if (wasOpen && restoreFocus) {
      queueMicrotask(() => this.menuButton?.nativeElement.focus());
    }
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    if (this.isMenuOpen()) {
      this.closeMenu(true);
    }
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'mobile-navigation-open');
  }
}
