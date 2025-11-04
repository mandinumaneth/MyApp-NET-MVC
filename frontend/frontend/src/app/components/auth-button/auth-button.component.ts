import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-4">
      @if (auth.isAuthenticated$ | async) {
        <div class="flex items-center gap-4">
          @if (auth.user$ | async; as user) {
            <div class="flex items-center gap-2">
              @if (user.picture) {
                <img [src]="user.picture" [alt]="user.name || 'User'" class="w-8 h-8 rounded-full" />
              }
              <span class="text-sm font-medium text-gray-700">{{ user.name || user.email }}</span>
            </div>
          }
          <button
            (click)="logout()"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
            Logout
          </button>
        </div>
      } @else {
        <button
          (click)="login()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Login
        </button>
      }
    </div>
  `
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin
      }
    });
  }
}
