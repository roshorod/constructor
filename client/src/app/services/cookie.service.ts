import { Injectable } from '@angular/core';
import { LocalStoreService } from './localstore.service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  public get cookie(): string {
    return this.getCookie(this.cookieName);
  }

  public cookieName = 'JSESSIONID';

  constructor(local: LocalStoreService) {
    if(this.getCookie(this.cookieName) == '') {
      local.clear();
      this.setCookie(this.cookieName, this.makeUUID(), 1);
    }
    else
      console.info("Session recognized")
  }

  public deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  public getCookie(name: string) {
    const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }

    return '';
  }

  public setCookie(name: string, value: string, expireDays: number, path: string = '') {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);

    const expires = `expires=${d.toUTCString()}`;
    const cpath = path ? `; path=${path}` : '';

    document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
  }

  private makeUUID() {
    var d = new Date().getTime();

    var d2 = ((typeof performance !== 'undefined')
      && performance.now
      && (performance.now() * 1000))
      || 0;

    return 'sxxxxxxx-2xxx-yxxx-xxxxxxxxyxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}
