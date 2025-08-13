import {Component, OnInit} from '@angular/core';
import {ThemeService} from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.init();
  }

  title = 'jwt-service-app';

}
