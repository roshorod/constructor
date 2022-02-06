import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  private keys = '';

  private keyTable = 'localkeys';

  constructor() {
    this.keys = localStorage.getItem(this.keyTable) ?? '';
  }

  public async setValue(value: string): Promise<string> {
    return Promise.resolve(value)
      .then(value => {
        const keys = this.keys.split(' ');

        for(const key of keys) {
          const storedValue = localStorage.getItem(key);

          if (storedValue == value) {
            return key;
          }
        }

        const key = this.genKey();
        this.keys += key + ' ';

        localStorage.setItem(key, value);

        localStorage.setItem(this.keyTable, this.keys);

        return key;
      });
  }

  public async getValue(key: string): Promise<string> {
    return Promise.resolve(key)
      .then(key => {
        return localStorage.getItem(key)!;
      });
  }

  public delValue(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }

  private genKey (): string {
    var d = new Date().getTime();

    var d2 = ((typeof performance !== 'undefined')
      && performance.now
      && (performance.now() * 1000))
      || 0;

    return 'local-xxxx-yyyy'.replace(/[xy]/g, function(c) {
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
