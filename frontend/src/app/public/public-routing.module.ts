import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../services/login.guard';

//Components
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProvidersListComponent } from './components/providers-list/providers-list.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProviderRegisterComponent } from './components/provider-register/provider-register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', component: HomeComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'providers-list', component: ProvidersListComponent },
      { path: 'user-register', component: UserRegisterComponent },
      { path: 'provider-register', component: ProviderRegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
