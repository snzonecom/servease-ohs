import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// Modules for form binding and HTTP requests
import { FormsModule } from '@angular/forms';  // For two-way binding (ngModel)
import { HttpClientModule } from '@angular/common/http';  // For HTTP requests

// Feature Modules
import { ProviderModule } from './provider/provider.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { UnauthorizedComponent } from './services/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    ProviderModule,
    AdminModule,
    BrowserAnimationsModule,
    FormsModule,  // Added FormsModule
    HttpClientModule // Added HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
