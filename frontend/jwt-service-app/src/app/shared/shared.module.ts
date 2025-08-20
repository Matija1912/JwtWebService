import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {RouterLink} from "@angular/router";
import {FooterComponent} from './components/footer/footer.component';
import { InfoBlockComponent } from './components/info-block/info-block.component';
import { CharLimitPipe } from './pipes/char-limit.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    InfoBlockComponent,
    CharLimitPipe,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    InfoBlockComponent,
    CharLimitPipe,
    PaginationComponent
  ]
})
export class SharedModule { }
