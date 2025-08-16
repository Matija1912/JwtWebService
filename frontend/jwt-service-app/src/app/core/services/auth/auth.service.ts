import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authApiUrl: string = environment.API_URL + '/auth';
  sessionRestoreUrl: string = environment.API_URL + '/sessionRestore';

  private currentUserSubject = new BehaviorSubject<{id: string, username: string, email: string} | null>(null);
  currentUserObservable = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  register = (account: {username: string, email: string, password: string}) => {
    const user = {
      username: account.username,
      email: account.email,
      password: account.password
    }
    return this.http.post<{status: string, account: {username: string, email: string, password: string}}>(this.authApiUrl + '/register', user);
  }

  login = (credentials: {email: string, password: string}) => {
    const user = {
      email: credentials.email,
      password: credentials.password
    }
    return this.http.post<{
      status: string,
      message: 'Login successful',
      account: {id: string, username: string, email: string},
      token: string
    }>(this.authApiUrl + '/login', user).pipe(
      tap(result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.account.username);
        localStorage.setItem('email', result.account.email);
        localStorage.setItem('id', result.account.id);
        this.currentUserSubject.next(result.account);

      })
    );
  }

  logout = () => {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  }

  refreshUser = () => {
    const token =   localStorage.getItem('token');
    const username =   localStorage.getItem('username');
    const email =   localStorage.getItem('email');
    const id =   localStorage.getItem('id');
    if(!token || !username || !email || !id){
      this.currentUserSubject.next(null);
      console.log('no user data in local storage')
      return;
    }
    return this.http.get<{status: string, user: {id: string, username: string, email: string}}>(this.sessionRestoreUrl + '/me').pipe(
      tap({
        next: result => {
          this.currentUserSubject.next(result.user);
        },
        error: err => {
          this.logout();
        }
      })
    );
  }

  setUser = (user: {id: string, username: string, email: string}) => {
    this.currentUserSubject.next(user);
  }

}
