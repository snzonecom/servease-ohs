import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PendingTransactionsComponent } from './components/pending-transactions/pending-transactions.component';
import { SchedBookingComponent } from './components/sched-booking/sched-booking.component';
import { CompletedBookingsComponent } from './components/completed-bookings/completed-bookings.component';
import { RateProviderComponent } from './components/rate-provider/rate-provider.component';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { CarouselModule } from 'primeng/carousel';
import { BookServiceComponent } from './components/book-service/book-service.component';
import { ProviderListComponent } from './components/provider-list/provider-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    UserLayoutComponent,
    UserProfileComponent,
    PendingTransactionsComponent,
    SchedBookingComponent,
    CompletedBookingsComponent,
    RateProviderComponent,
    UserNavComponent,
    UserHomeComponent,
    BookServiceComponent,
    ProviderListComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CardModule,
    ImageModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    CarouselModule,
    HttpClientModule,
    AccordionModule
  ]
})
export class UserModule { }
