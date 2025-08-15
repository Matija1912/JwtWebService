import { Component } from '@angular/core';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {InfoData} from '../../../shared/components/info-block/infoData.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: '../auth.css'
})
export class LoginComponent {

  inputData: {email: string, password: string} = {email:'', password:''};

  infoData: InfoData | null = null;

  constructor(private authService: AuthService, private router: Router){}

  login = () => {
    console.log('Logged in');
    this.authService.login({email: this.inputData.email, password: this.inputData.password}).subscribe({
      next: (result) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.infoData = {
          infoType: 'danger',
          message: err.error.message
        };
      }
    })
  }

}
