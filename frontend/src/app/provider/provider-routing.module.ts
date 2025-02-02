import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProviderLayoutComponent } from './provider-layout/provider-layout.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { ProviderServicesComponent } from './components/provider-services/provider-services.component';
import { MyTransactionsComponent } from './components/my-transactions/my-transactions.component';
import { GenerateReportComponent } from './components/generate-report/generate-report.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderLayoutComponent,
    children: [
      { path: 'provider-dashboard', component: DashboardComponent },
      { path: 'provider-details', component: ProviderProfileComponent },
      { path: 'provider-services', component: ProviderServicesComponent },
      { path: 'provider-transactions', component: MyTransactionsComponent },
      { path: 'generate-report', component: GenerateReportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
