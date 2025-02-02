import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProviderLayoutComponent } from './provider-layout/provider-layout.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ProviderNavComponent } from './components/provider-nav/provider-nav.component';
import { GenerateReportComponent } from './components/generate-report/generate-report.component';
import { MyTransactionsComponent } from './components/my-transactions/my-transactions.component';
import { ProviderServicesComponent } from './components/provider-services/provider-services.component';
import { TableModule } from 'primeng/table';
import { TabView, TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    DashboardComponent,
    ProviderLayoutComponent,
    ProviderProfileComponent,
    ProviderNavComponent,
    GenerateReportComponent,
    MyTransactionsComponent,
    ProviderServicesComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    CardModule,
    ImageModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    TableModule,
    TabViewModule
  ]
})
export class ProviderModule { }
