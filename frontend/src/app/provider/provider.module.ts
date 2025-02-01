import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProviderLayoutComponent } from './provider-layout/provider-layout.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { PendingBookingsComponent } from './components/pending-bookings/pending-bookings.component';
import { ConfirmedBookingsComponent } from './components/confirmed-bookings/confirmed-bookings.component';
import { CompletedBookingsComponent } from './components/completed-bookings/completed-bookings.component';
import { RateCustomersComponent } from './components/rate-customers/rate-customers.component';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ProviderNavComponent } from './components/provider-nav/provider-nav.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProviderLayoutComponent,
    ProviderProfileComponent,
    PendingBookingsComponent,
    ConfirmedBookingsComponent,
    CompletedBookingsComponent,
    RateCustomersComponent,
    ProviderNavComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    CardModule,
    ImageModule,
    ButtonModule,
    FormsModule,
    DialogModule

  ]
})
export class ProviderModule { }
