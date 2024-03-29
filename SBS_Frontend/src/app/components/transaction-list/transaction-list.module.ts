import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list.component';
import { SharedModule } from '../../shared/shared.module';
// Import other components and modules as needed

@NgModule({
  declarations: [
    TransactionListComponent,
    // Other components declared in this module
  ],
  imports: [
    CommonModule,
    SharedModule
    // Other modules imported in this module
  ],
  exports: [
    TransactionListComponent
    // Other components or modules you want to export
  ]
})
export class TransactionListModule{ }
