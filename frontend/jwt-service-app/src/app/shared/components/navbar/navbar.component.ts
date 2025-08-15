import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy{

  @Output() toggleTheme = new EventEmitter();

  currentUser: {id: string, username: string, email: string} | null = null;
  private subscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.authService.currentUserObservable
    .subscribe(user => {
      this.currentUser = user;
    })
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
