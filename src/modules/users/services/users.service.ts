import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser, IApiAnswer, AuthService } from '../../shared';

@Injectable()
export class UsersService {
  readonly ROOT_URL = 'http://www.t.local/api2/user/';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  list(): Observable<IUser[]> {
    return this.http.get<IApiAnswer>(this.ROOT_URL + 'get_users.php').pipe(
      map(data => data.data)
    );
  }

  add(user: IUser): Observable<boolean> {
    return this.http.post<IApiAnswer>(this.ROOT_URL + 'registration.php', user).pipe(
      map(data => data.is_success)
    );
  }

  login(user: IUser): Observable<boolean> {
    return this.http.post<IApiAnswer>(`${this.ROOT_URL}login.php`, user).pipe(
      map(data => {
        this.authService.token = data.data.authToken;
        return data.is_success;
      })
    );
  }

  logout(): void {
    this.authService.deleteToken();
  }

  getUserIdByToken(token: string): Observable<String> {
    return this.http.post<IApiAnswer>(`${this.ROOT_URL}get_user_id_by_token.php`, {token}).pipe(
      map(data => {
        let ret: number = null;
        if (data.is_success) {
          ret = data.data;
        }
        return ret;
      })
    );
  }

  getUserById(userId: number): Observable<IUser> {
    return this.http.post<IApiAnswer>(`${this.ROOT_URL}get_user_by_user_id.php`, {userId}).pipe(
      map(data => {
        let ret: IUser = null;
        if (data.is_success) {
          ret = data.data;
        }
        return ret;
      })
    );
  }

  getCurrentUser(): Observable<IUser> {
    return this.authService.token$.pipe(
      take(1), 
      flatMap(token => {
        return this.getUserIdByToken(token);
      }),
      flatMap(userId => {
        return this.getUserById(userId);
      })
    );
  }
}
