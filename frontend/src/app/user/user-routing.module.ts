import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PendingTransactionsComponent } from './components/pending-transactions/pending-transactions.component';
import { SchedBookingComponent } from './components/sched-booking/sched-booking.component';
import { CompletedBookingsComponent } from './components/completed-bookings/completed-bookings.component';
import { RateProviderComponent } from './components/rate-provider/rate-provider.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { BookServiceComponent } from './components/book-service/book-service.component';
import { ProviderListComponent } from './components/provider-list/provider-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {path: 'home', component: UserHomeComponent},
      {path: 'user-profile', component: UserProfileComponent},
      {path: 'pending-bookings', component: PendingTransactionsComponent},
      {path: 'confirmed-bookings', component: SchedBookingComponent},
      {path: 'completed-bookings', component: CompletedBookingsComponent},
      {path: 'rate-provider', component: RateProviderComponent},
      {path: 'book-service', component: BookServiceComponent},
      {path: 'providers-list', component: ProviderListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
