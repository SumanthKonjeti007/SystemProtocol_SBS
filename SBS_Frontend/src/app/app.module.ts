import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { HeaderComponent } from './components/header/header.component';
import { CreditComponent } from './components/credit/credit.component';
import { FundsComponent } from './components/funds/funds.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TfOutsideComponent } from './components/tf-outside/tf-outside.component';
import { TfWithinComponent } from './components/tf-within/tf-within.component';
import { TranHisComponent } from './components/tran-his/tran-his.component';
import { UpdateComponent } from './components/update/update.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastrModule } from 'ngx-toastr';

//import { HeaderComponent } from './components/header/header.component';


import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionActionComponent } from './components/transaction-action/transaction-action.component';
import { CapitalizePipe } from './capitalize.pipe';
import { InternalUserHomeComponent } from './components/internal-user-home/internal-user-home.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

import { AdminComponent } from './components/user/admin.component';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { IntuserheaderComponent } from './intuserheader/intuserheader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { TfInstantComponent } from './components/tf-instant/tf-instant.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgModule } from '@angular/core';
//import { ReactiveFormsModule } from '@angular/forms';
//import { UpdateComponent } from './path-to-your-update-component/update.component'; // Update the path
//import { ProfileComponent } from './profile/profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderAdminComponent,
    HeaderComponent,
    CreditComponent,
    FundsComponent,
    ProfileComponent,
    TfOutsideComponent,
    TfWithinComponent,
    TranHisComponent,
    AdminComponent,
    AccountComponent,
    TransactionListComponent,
    TransactionActionComponent,
    CapitalizePipe,
    InternalUserHomeComponent,
    UpdateComponent,
    UserDetailsComponent,
    OtpVerificationComponent,
    IntuserheaderComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    //NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
