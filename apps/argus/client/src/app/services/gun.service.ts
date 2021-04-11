import { Injectable } from '@angular/core'
import { GunRoot, Version } from '@kylebjordahl/argus/domain'
import * as Gun from 'gun/gun'
import { Observable, ReplaySubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class GunService {
  private gun = Gun<Record<string, GunRoot>>(window.location.origin + '/gun')
  private _projectId: string = 'test'

  public get projectId(): string {
    return this._projectId
  }

  public get db() {
    if (this._projectId) {
      return this.gun.get(this._projectId)
    }
  }

  private _user: ReturnType<GunDb['user']> & { is: boolean }

  private _user$ = new ReplaySubject<{ alias: string }>(1)
  get user$(): Observable<{ alias: string }> {
    return this._user$.asObservable()
  }

  private _isLoggedIn = false
  get isLoggedIn(): boolean {
    return this._isLoggedIn
  }

  constructor() {
    this._user = this.db.user().recall({ sessionStorage: true }, () => {
      this._user$.next(this._user.is as any)
    }) as any
    console.log('Attempting gun @', window.location.origin + '/gun')
    window['gun'] = this.db
  }

  async signUp(username: string, password: string): Promise<boolean> {
    await new Promise((res) => this._user.create(username, password, res))
    return this.login(username, password)
  }

  async login(username: string, password: string): Promise<boolean> {
    await new Promise((res) => this._user.auth(username, password, res))
    this._isLoggedIn = !!this._user.is
    this._user$.next(this._user.is as any)
    return this.isLoggedIn
  }

  async logout() {
    await new Promise((res) => this._user.leave())
  }
}

type GunDb = ReturnType<typeof Gun>
