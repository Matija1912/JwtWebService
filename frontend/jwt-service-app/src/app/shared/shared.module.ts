import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterLink} from "@angular/router";
import {FooterComponent} from './components/footer/footer.component';
import { InfoBlockComponent } from './components/info-block/info-block.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    InfoBlockComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    InfoBlockComponent
  ]
})
export class SharedModule { }
