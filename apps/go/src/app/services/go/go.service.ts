import { Injectable } from '@angular/core';
import * as Gun from 'gun/gun';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoService {
  private gun = Gun();

  private _user: ReturnType<GunDb['user']> & { is: boolean };

  private _user$ = new ReplaySubject<{ alias: string }>(1);
  get user$(): Observable<{ alias: string }> {
    return this._user$.asObservable();
  }

  private _isLoggedIn = false;
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  constructor() {
    this._user = this.gun.user().recall({ sessionStorage: true }, () => {
      this._user$.next(this._user.is as any);
    }) as any;
  }

  async signUp(username: string, password: string): Promise<boolean> {
    await new Promise((res) => this._user.create(username, password, res));
    return this.login(username, password);
  }

  async login(username: string, password: string): Promise<boolean> {
    await new Promise((res) => this._user.auth(username, password, res));
    this._isLoggedIn = !!this._user.is;
    this._user$.next(this._user.is as any);
    return this.isLoggedIn;
  }

  async logout() {
    await new Promise((res) => this._user.leave());
  }
}

type GunDb = ReturnType<typeof Gun>;
