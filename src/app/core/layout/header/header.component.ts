import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly auth = inject(AuthService);

  @Output() readonly loginRequested = new EventEmitter<void>();

  readonly isMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);

  openLogin(): void {
    this.closeMenus();
    this.loginRequested.emit();
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
