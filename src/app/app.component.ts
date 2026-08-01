import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { LoginPopupComponent } from './features/auth/login-popup/login-popup.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, LoginPopupComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoginOpen = false;
}
