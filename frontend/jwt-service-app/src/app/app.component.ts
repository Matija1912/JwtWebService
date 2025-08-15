import {Component, OnInit} from '@angular/core';
import {ThemeService} from './core/services/theme.service';
import {AuthService} from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(public themeService: ThemeService, private authService: AuthService) {}

  ngOnInit() {
    this.themeService.init();
    this.authService.refreshUser()?.subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  title = 'jwt-service-app';

}
