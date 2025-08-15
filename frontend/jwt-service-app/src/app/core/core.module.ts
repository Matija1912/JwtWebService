import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './features/auth/logout/logout.component';



@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
