import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Frame } from './frame/frame';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, title: 'RAG Help Desk - Login' },

  {
    path: 'app',
    canActivate: [authGuard],
    component: Frame,
    children: [
      {
        path: 'chat',
        loadComponent: () => import('./chat/chat').then(m => m.ChatComponent),
        title: 'Chatbot'
      },
      {
        path: 'nps',
        loadComponent: () => import('./nps/nps').then(m => m.NPS),
        title: 'NPS Metrics'
      },
      {
        path: 'users',
        loadComponent: () => import('./usermanagement/usermanagement').then(m => m.Usermanagement),
        title: 'User Management'
      },
    
      {
        path: 'agent-dashboard',
        loadComponent: () => import('./agent-dashboard/agent-dashboard').then(m => m.AgentDashboardComponent),
        title: 'Agent Dashboard'
      },
      { path: '', pathMatch: 'full', redirectTo: 'chat' },
    ]
  },

  { path: '**', redirectTo: 'login' },
];