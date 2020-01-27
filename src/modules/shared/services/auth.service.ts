import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private tokenSubject: BehaviorSubject<string>;

  constructor() {
    this.tokenSubject = new BehaviorSubject(this.getTokenFromStorage());
  }

  get token$(): Observable<string> {
    return this.tokenSubject.asObservable();
  }

  get token(): string {
    return this.tokenSubject.getValue(); // Можно и this.getTokenFromStorage(), без разницы
  }

  set token(token: string) {
    this.saveTokenToStorage(token);
    this.tokenSubject.next(token);
  }

  deleteToken(): void {
    this.deleteTokenFromStorage();
    this.tokenSubject.next(null);
  }

  isAuth(): boolean {
    return !!this.token;
  }

  isTokenExpired(): boolean {
    return false; // TODO
  }

  private getTokenFromStorage(): string {
    return localStorage.getItem('_authToken');
  }

  private saveTokenToStorage(token: string): void {
    localStorage.setItem('_authToken', token);
  }

  private deleteTokenFromStorage(): void {
    localStorage.removeItem('_authToken');
  }
}
