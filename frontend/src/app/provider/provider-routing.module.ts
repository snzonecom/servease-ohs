import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProviderLayoutComponent } from './provider-layout/provider-layout.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { PendingBookingsComponent } from './components/pending-bookings/pending-bookings.component';
import { ConfirmedBookingsComponent } from './components/confirmed-bookings/confirmed-bookings.component';
import { CompletedBookingsComponent } from './components/completed-bookings/completed-bookings.component';
import { RateCustomersComponent } from './components/rate-customers/rate-customers.component';

const routes: Routes = [
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    children: [
      {path: 'provider-dashboard', component: DashboardComponent},
      {path: 'pending-bookings', component: PendingBookingsComponent},
      {path: 'confirmed-bookings', component: ConfirmedBookingsComponent},
      {path: 'completed-bookings', component: CompletedBookingsComponent},
      {path: 'rate-customers', component: RateCustomersComponent},
      {path: 'provider-details', component: ProviderProfileComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
