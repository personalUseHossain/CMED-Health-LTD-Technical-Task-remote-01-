import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];