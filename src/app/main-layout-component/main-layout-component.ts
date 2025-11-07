import { Component, AfterViewInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-main-layout-component',
    standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive

  ],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.css'
})
export class MainLayoutComponent implements AfterViewInit{
  protected readonly title = signal('nav');

 
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {

    if (isPlatformBrowser(this.platformId)) {
      try {
        const bootstrap = await import('bootstrap');
        const Tooltip = bootstrap.Tooltip; 
        const tooltipTriggerList = Array.from(
          document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.forEach((el) => new Tooltip(el));
      } catch (err) {
        console.error('Error al cargar dinámicamente Bootstrap: ', err);
      }
    }
  }

}
