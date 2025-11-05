import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PrescriptionListComponent } from '../prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';
import { ReportsComponent } from '../reports/reports.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'prescriptions', component: PrescriptionListComponent },
      { path: 'prescriptions/new', component: PrescriptionFormComponent },
      { path: 'prescriptions/edit/:id', component: PrescriptionFormComponent },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'prescriptions', pathMatch: 'full' }
    ]
  }
];