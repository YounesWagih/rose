import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LoginPopupService } from '../../services/login-popup.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly wishlist = inject(WishlistService);
  private readonly loginPopup = inject(LoginPopupService);

  readonly isMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);

  openLogin(): void {
    this.closeMenus();
    this.loginPopup.open();
  }

  toggleMenu(): void {
    this.isUserMenuOpen.set(false);
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  toggleUserMenu(): void {
    this.isMenuOpen.set(false);
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenus(): void {
    this.isMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
  }
}
