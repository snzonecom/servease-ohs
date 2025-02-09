import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PendingApplicationsComponent } from './components/pending-applications/pending-applications.component';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from "primeng/floatlabel";
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ServiceCategoriesComponent } from './components/service-categories/service-categories.component';
import { ListProvidersComponent } from './components/list-providers/list-providers.component';
import { DeletedCategoriesComponent } from './components/deleted-categories/deleted-categories.component';
import { DeletedProvidersComponent } from './components/deleted-providers/deleted-providers.component';
import { SystemDetailsComponent } from './components/system-details/system-details.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminNavbarComponent,
    PendingApplicationsComponent,
    ServiceCategoriesComponent,
    ListProvidersComponent,
    DeletedCategoriesComponent,
    DeletedProvidersComponent,
    SystemDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    DialogModule,
    InputTextModule
  ]
})
export class AdminModule { }
