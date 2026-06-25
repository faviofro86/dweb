import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', title: 'Dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'visitas', title: 'Visitas', data: { title: 'Gestión de visitas' }, loadComponent: () => import('./pages/visits/visits').then((m) => m.Visits) },
      { path: 'salas', title: 'Salas de reunión', data: { title: 'Salas de reunión' }, loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms) },
      { path: 'espacios', title: 'Espacios', data: { title: 'Gestión de espacios' }, loadComponent: () => import('./pages/spaces/spaces').then((m) => m.Spaces) },
      { path: 'historial', title: 'Historial', data: { title: 'Historial de actividad' }, loadComponent: () => import('./pages/history/history').then((m) => m.History) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
