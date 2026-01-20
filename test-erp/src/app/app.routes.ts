import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [loginGuard],
    loadComponent: () => import('./core/layout/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'proforma-invoice',
        pathMatch: 'full'
      },
      {
        path: 'proforma-invoice',
        loadComponent: () => import('./features/proforma-invoice/proforma-invoice.component').then(m => m.ProformaInvoiceComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
