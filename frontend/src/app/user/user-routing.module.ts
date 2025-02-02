import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { BookServiceComponent } from './components/book-service/book-service.component';
import { ProviderListComponent } from './components/provider-list/provider-list.component';
import { UserTransactionsComponent } from './components/user-transactions/user-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {path: 'home', component: UserHomeComponent},
      {path: 'user-profile', component: UserProfileComponent},
      {path: 'book-service', component: BookServiceComponent},
      {path: 'providers-list/:id', component: ProviderListComponent},
      {path: 'user-transactions', component: UserTransactionsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }