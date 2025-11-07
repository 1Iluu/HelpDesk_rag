import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ChatComponent } from './chat/chat';
import { MainLayoutComponent } from './main-layout-component/main-layout-component';


export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'app', 
    component: MainLayoutComponent,
    
    children: [
      {
        path: 'products',
        component: ChatComponent 
      },
    
      {
        path: '',
        redirectTo: 'app',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  },
];