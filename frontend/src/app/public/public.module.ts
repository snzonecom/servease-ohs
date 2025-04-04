import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './components/login/login.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { HomeComponent } from './components/home/home.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { ProviderRegisterComponent } from './components/provider-register/provider-register.component';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { PublicNavComponent } from './components/public-nav/public-nav.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

@NgModule({
  declarations: [
    LoginComponent,
    PublicLayoutComponent,
    HomeComponent,
    UserRegisterComponent,
    ProviderRegisterComponent,
    PublicNavComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ButtonModule,
    PasswordModule,
    CardModule,
    DialogModule,
    ImageModule,
    FormsModule,
    FileUploadModule,
    CalendarModule,
    CarouselModule,
    TagModule,
    AccordionModule,
    ReactiveFormsModule
  ],
})
export class PublicModule { }
