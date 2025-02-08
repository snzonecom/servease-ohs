import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { PendingApplicationsComponent } from './components/pending-applications/pending-applications.component';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { SuspendedAccountsComponent } from './components/suspended-accounts/suspended-accounts.component';
import { ServiceCategoriesComponent } from './components/service-categories/service-categories.component';
import { ListProvidersComponent } from './components/list-providers/list-providers.component';
import { DeletedCategoriesComponent } from './components/deleted-categories/deleted-categories.component';
import { DeletedProvidersComponent } from './components/deleted-providers/deleted-providers.component';
import { SystemDetailsComponent } from './components/system-details/system-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {path: 'admin-dashboard', component: AdminDashboardComponent},
      {path: 'admin-navbar', component: AdminNavbarComponent},
      {path: 'pending-applications', component: PendingApplicationsComponent},
      {path: 'reports-list', component: ReportsListComponent},
      {path: 'suspended-accounts', component: SuspendedAccountsComponent},
      {path: 'service-categories', component: ServiceCategoriesComponent},
      {path: 'providers-list', component: ListProvidersComponent},
      {path: 'deleted-categories', component: DeletedCategoriesComponent},
      {path: 'deleted-providers', component: DeletedProvidersComponent},
      {path: 'system-details', component: SystemDetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
