import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import {ProjectsComponent} from './features/projects/projects.component';
import {NewProjectComponent} from './features/projects/new-project/new-project.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'projects', component: ProjectsComponent},
  { path: 'newProject', component: NewProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
