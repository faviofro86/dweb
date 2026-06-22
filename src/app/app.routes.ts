import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', title: 'Dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'historial', title: 'Historial', data: { title: 'Historial de actividad' }, loadComponent: () => import('./pages/history/history').then((m) => m.History) },
     { path: 'salas', title: 'Salas de reunión', data: { title: 'Salas de reunión' }, loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
