import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { SharedModule } from './shared/shared.module';
import { TestComponent } from './features/test/test.component';
import { FooterComponent } from './features/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
