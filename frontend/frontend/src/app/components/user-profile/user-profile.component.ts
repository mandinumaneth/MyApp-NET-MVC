import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 mt-6">
      @if (auth.isAuthenticated$ | async) {
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>

          @if (auth.user$ | async; as user) {
            <div class="space-y-4">
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                @if (user.picture) {
                  <img [src]="user.picture" [alt]="user.name || 'User'" class="w-16 h-16 rounded-full" />
                }
                <div>
                  <p class="text-lg font-semibold text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
              </div>

              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-2">Raw User Object (from ID Token)</h3>
                <pre class="text-xs bg-white p-3 rounded overflow-auto max-h-64 text-gray-800">{{ user | json }}</pre>
              </div>

              <div class="p-4 bg-green-50 rounded-lg">
                <h3 class="font-semibold text-green-900 mb-2">Permissions Check</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">Permissions in token:</span>
                    <span class="text-gray-700">{{ getUserPermissions(user) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">Roles in token:</span>
                    <span class="text-gray-700">{{ getUserRoles(user) }}</span>
                  </div>
                </div>
              </div>

              <button
                (click)="getAccessToken()"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                Show Access Token (for API calls)
              </button>

              @if (accessToken) {
                <div class="p-4 bg-purple-50 rounded-lg">
                  <h3 class="font-semibold text-purple-900 mb-2">Access Token (used for API authorization)</h3>
                  <pre class="text-xs bg-white p-3 rounded overflow-auto max-h-64 text-gray-800 break-all">{{ accessToken }}</pre>
                  <div class="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p class="text-sm text-yellow-800 font-medium">⚠️ Decoded Token Claims:</p>
                    <pre class="text-xs mt-2 text-gray-700">{{ decodedToken | json }}</pre>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-yellow-800">You are not logged in. Please login to see your profile.</p>
        </div>
      }
    </div>
  `
})
export class UserProfileComponent {
  accessToken: string | null = null;
  decodedToken: any = null;

  constructor(public auth: AuthService) {}

  getUserPermissions(user: any): string {
    const permissions = user?.permissions || user?.['https://myapp.com/permissions'];
    return permissions ? JSON.stringify(permissions) : 'None found';
  }

  getUserRoles(user: any): string {
    const roles = user?.roles || user?.['https://myapp.com/roles'];
    return roles ? JSON.stringify(roles) : 'None found';
  }

  getAccessToken(): void {
    this.auth.getAccessTokenSilently().subscribe({
      next: (token) => {
        this.accessToken = token;
        // Decode JWT token (simple base64 decode of payload)
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = parts[1];
            const decoded = JSON.parse(atob(payload));
            this.decodedToken = decoded;
          }
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      },
      error: (err) => console.error('Error getting access token:', err)
    });
  }
}
