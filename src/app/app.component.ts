import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { LoginPopupComponent } from './features/auth/components/login-popup/login-popup.component';
import { LoginPopupService } from './features/auth/services/login-popup.service';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, LoginPopupComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly loginPopup = inject(LoginPopupService);
}
