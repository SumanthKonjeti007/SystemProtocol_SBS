// In internal-user.module.ts or the relevant module file
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InternalUserHomeComponent } from './internal-user-home.component';

@NgModule({
  declarations: [InternalUserHomeComponent],
  imports: [
    CommonModule,
    SharedModule // Import SharedModule here
  ]
})
export class InternalUserModule {}
