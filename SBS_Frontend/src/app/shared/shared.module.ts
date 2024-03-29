import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntheaderComponent } from './intheader/intheader.component';
import { TransactionListModule } from '../components/transaction-list/transaction-list.module';

@NgModule({
  declarations: [IntheaderComponent],
  imports: [
    CommonModule,
    
  ],
  exports: [
    IntheaderComponent // Export so it can be used in other modules
  ]
})
export class SharedModule { }
