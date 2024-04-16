import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/user/admin.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateComponent } from './components/update/update.component';
import { CreditComponent } from './components/credit/credit.component';
import { FundsComponent } from './components/funds/funds.component';
import { TfWithinComponent } from './components/tf-within/tf-within.component';
import { TfOutsideComponent } from './components/tf-outside/tf-outside.component';
import { TranHisComponent } from './components/tran-his/tran-his.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';
import { TransactionActionComponent } from './components/transaction-action/transaction-action.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { AccountComponent } from './components/account/account.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { TransactionListComponent} from './components/transaction-list/transaction-list.component';
import { InternalUserHomeComponent } from './components/internal-user-home/internal-user-home.component';
import { IntUpdateProfileComponent } from './components/int-update-profile/int-update-profile.component';
import { IntTransactionsComponent } from './int-transactions/int-transactions.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { OrderComponent } from './components/orders/orders.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';
import { MerchantRequestsComponent } from './components/merchantRequests/merchantRequests.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'profile',
    component: ProfileComponent
  },
  {
    path:'update',
    component: UpdateComponent
  },
  {
    path:'credit',
    component: CreditComponent

  },
  {
    path:'funds',
    component: FundsComponent
  },
  {
    path: 'tf_within',
    component: TfWithinComponent
  },
  { path: 'tf_outside', 
  component: TfOutsideComponent 
  },
  {
    path: 'adminUsers',
    component: AdminComponent
  },
  {
    path: 'accounts',
    component: AccountComponent
  },
  {
    path: 'tran-his',
    component: TranHisComponent
  },
  {
    path: 'update',
    component:UpdateComponent
  },
  {
    path: 'user-details',
    component:UserDetailsComponent
  },
  {
    path: 'otp-verification', 
    component: OtpVerificationComponent
  },{
    path:'home-admin',
    component:HomeAdminComponent
  },
  {
    path:'header-admin',
    component: HeaderAdminComponent
  },
  {
    path:'int-transactions',
    component: IntTransactionsComponent
  },
  {
    path:'edit-Transaction',
    component: EditTransactionComponent
  },
  {
    path:'payment-gateway',
    component: OrderComponent
  },
  {
    path:'user-activity',
    component: UserActivityComponent
  },
  {
    path:'request-payment',
    component: OrderComponent
  },
  {
    path: 'merchant-requests',
    component: MerchantRequestsComponent
  },
  {
    path:'', redirectTo:'LandingPage',pathMatch:'full'
    
  },
  
  // Adding routes for transaction management
  { path: 'intuser-home', 
  component: InternalUserHomeComponent },
  { path: 'intuser-home/transactions', 
  component: TransactionListComponent }, // Use a different path for transactions
  { path: 'intuser-home/transaction-action', 
  component: TransactionActionComponent }, // Use a different path for transaction action
  { path: 'transaction/:action/:id', component: TransactionActionComponent },
  { path: 'int-update-profile', component: IntUpdateProfileComponent },
  {
    path:'LandingPage',
    component:LandingPageComponent
  },
  { path: '', redirectTo: 'intuser-home', pathMatch: 'full' },


  // Routes for user and internal user home pages with role-based redirection
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'intuser-home', component: InternalUserHomeComponent, canActivate: [AuthGuard], data: { roles: ['internal'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }