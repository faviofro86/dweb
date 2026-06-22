import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', title: 'Dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
