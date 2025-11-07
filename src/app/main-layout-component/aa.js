import { Routes } from '@angular/router';

// --- 1. Importa tus componentes "raíz" ---
import { Login } from './login/login';
// Importa el "cascarón" (layout principal)
// Asegúrate que la ruta coincida con tu carpeta, que creo era 'main-layout-component'
import { MainLayoutComponent } from './main-layout-component/main-layout.component';

// --- 2. Importa los componentes "hijos" (los que van DENTRO del cascarón) ---
import { ChatComponent } from './chat/chat';
// Importa el componente de bienvenida que acabamos de crear
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  // --- Ruta de Login (Sin cascarón) ---
  {
    path: 'login',
    component: Login
  },

  // --- Ruta del Cascarón (Cargará el MainLayoutComponent) ---
  {
    path: 'app', // La URL base para la app autenticada
    component: MainLayoutComponent,
    
    // --- Rutas Hijas (Se cargarán DENTRO del <router-outlet> del cascarón) ---
    children: [
      {
        // Ruta para el chat
        // URL completa: /app/products
        path: 'products',
        component: ChatComponent 
      },
      {
        // Ruta para el "Home" del cascarón
        // URL completa: /app/home
        path: 'home',
        component: WelcomeComponent
      },
      {
        // Ruta para el dashboard (muestra bienvenida)
        // URL completa: /app/dashboard
        path: 'dashboard',
        component: WelcomeComponent
      },
      {
        // Ruta para customers (muestra bienvenida)
        // URL completa: /app/customers
        path: 'customers',
        component: WelcomeComponent
      },
      
      // --- Redirección por defecto DENTRO del cascarón ---
      // Si el usuario navega a /app (justo después del login),
      // será redirigido a /app/home
      {
        path: '',
        redirectTo: 'home', // ¡Este es el cambio clave!
        pathMatch: 'full'
      }
    ]
  },

  // --- Redirecciones Globales ---
  // Si el usuario va a la raíz del sitio, se redirige a /login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // Cualquier otra ruta que no exista, se redirige a /login
  {
    path: '**',
    redirectTo: 'login'
  },
];