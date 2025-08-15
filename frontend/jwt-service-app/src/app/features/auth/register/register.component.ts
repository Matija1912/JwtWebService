import { Component } from '@angular/core';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {InfoData} from '../../../shared/components/info-block/infoData.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: '../auth.css'
})
export class RegisterComponent {

  inputData: {username: string,email: string, password: string, passwordConfirmation: string} = {username:'', email:'', password:'', passwordConfirmation:''};

  infoData: InfoData | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register = (account: {username: string, email: string, password: string}) => {
    this.authService.register(account)
      .subscribe({
        next: (result) => {
          this.router.navigate(['/auth/login']);
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
