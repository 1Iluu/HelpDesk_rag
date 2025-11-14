import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  template: `
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
    <app-sidebar></app-sidebar>
      <main class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
export class Frame {}
