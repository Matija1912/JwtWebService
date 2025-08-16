import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './features/auth/logout/logout.component';
import { ProjectsComponent } from './features/projects/projects.component';



@NgModule({
  declarations: [
    LogoutComponent,
    ProjectsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
