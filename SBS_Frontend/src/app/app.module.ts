import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
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
import { CapitalizePipe } from './capitalize.pipe';
import { CardModule } from 'primeng/card';
import { ToastrModule } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
//import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
//import { AdminComponent } from './components/user/admin.component';

//import { HeaderComponent } from './components/header/header.component';

//import { IntuserheaderComponent } from './components/intuserheader/intuserheader.component';
//import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionActionComponent } from './components/transaction-action/transaction-action.component';
//import { CapitalizePipe } from './capitalize.pipe';
//import { InternalUserHomeComponent } from './components/internal-user-home/internal-user-home.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';
//import { IntuserheaderComponent } from './components/intuserheader/intuserheader.component';
import { AdminComponent } from './components/user/admin.component';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { InternalUserModule } from './components/internal-user-home/internal-user.module';
import { SharedModule } from './shared/shared.module';

//import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TransactionListModule } from './components/transaction-list/transaction-list.module';
import { IntTransactionsComponent } from './int-transactions/int-transactions.component';
//import { TfInstantComponent } from './components/tf-instant/tf-instant.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgModule } from '@angular/core';
//import { ReactiveFormsModule } from '@angular/forms';
//import { UpdateComponent } from './path-to-your-update-component/update.component'; // Update the path
//import { ProfileComponent } from './profile/profile.component';
import { IntUpdateProfileComponent } from './components/int-update-profile/int-update-profile.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { JwtHelperService } from './services/jwt-helper.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HomeAdminComponent,
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
    TransactionActionComponent,
    UpdateComponent,
    UserDetailsComponent,
    OtpVerificationComponent,
    CapitalizePipe,
    IntUpdateProfileComponent,
    IntTransactionsComponent,
    EditTransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastrModule,
    ButtonModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    InternalUserModule,
    TransactionListModule
    //NgbModule,
  ],
  
  providers: [], 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule { }
