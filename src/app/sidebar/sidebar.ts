import { Component, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
  <aside class="w-64 h-full flex flex-col bg-white dark:bg-[#111a22] border-r border-gray-200 dark:border-gray-800">
    <div class="flex items-center gap-4 px-6 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div class="size-6 text-primary">
        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
          <path clip-rule="evenodd" d="M39.998 12.236...Z" fill="currentColor" fill-rule="evenodd"></path>
        </svg>
      </div>
      <h2 class="text-gray-800 dark:text-white text-lg font-bold">Help Desk AI</h2>
    </div>

    <nav class="flex-1 px-4 py-6">
      <ul class="space-y-2">
        <li>
          <a routerLink="/app/chat"
             routerLinkActive="bg-primary/10 text-primary font-semibold"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm">
            <span class="material-symbols-outlined text-xl">smart_toy</span>
            <span>Chatbot</span>
          </a>
        </li>
        <li *ngIf="userRole !== 'ROLEUser'">
          <a routerLink="/app/nps"
             routerLinkActive="bg-primary/10 text-primary font-semibold"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm">
            <span class="material-symbols-outlined text-xl">leaderboard</span>
            <span>NPS Metrics</span>
          </a>
        </li>
        <li *ngIf="userRole === 'ROLEAdmin'">
          <a routerLink="/app/users"
             routerLinkActive="bg-primary/10 text-primary font-semibold"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm">
            <span class="material-symbols-outlined text-xl">group</span>
            <span>User Management</span>
          </a>
        </li>
      </ul>
    </nav>

<div class="mt-auto px-4 pb-4">
  <button
    (click)="onLogout()"
    class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm">
    <span class="material-symbols-outlined">logout</span>
    <span>Logout</span>
  </button>
</div>
  </aside>
  `
})
export class Sidebar {
  userRole: string = '';
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private authService: AuthService,
) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadRoleFromToken();
    }
  }

  loadRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role) {
        this.userRole = payload.role;
        return;
      }

      if (payload.authorities?.length > 0) {
        const auth = payload.authorities[0];
        if (auth.startsWith("ROLE")) {
          this.userRole = auth.replace("ROLE", "");
        }
      }

    } catch (e) {
      console.error("Error al decodificar token", e);
    }
  }
   onLogout() {
    this.authService.logout();  
  }
}
