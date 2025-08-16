import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { SharedModule } from './shared/shared.module';
import { TestComponent } from './features/test/test.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import { ProjectsComponent } from './features/projects/projects.component';
import { ProjectCardComponent } from './features/projects/project-card/project-card.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    ProjectsComponent,
    ProjectCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
