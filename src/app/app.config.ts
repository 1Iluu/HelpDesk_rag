import { provideHttpClient, withFetch,withInterceptors} from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth/auth.interceptor';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { provideMarkdown } from 'ngx-markdown'; // ← agregar



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideMarkdown(), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
     withInterceptors([authInterceptor,loaderInterceptor])
  ),

  ]
};
