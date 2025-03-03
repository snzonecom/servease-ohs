import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../services/login.guard';

//Components
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProviderRegisterComponent } from './components/provider-register/provider-register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', component: HomeComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'user-register', component: UserRegisterComponent },
      { path: 'provider-register', component: ProviderRegisterComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
