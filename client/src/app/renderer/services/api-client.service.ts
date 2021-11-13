import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Element } from '@renderer/models/element';
import { CookiesService } from '@services/cookie.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientSerivce {

  constructor(
    private http: HttpClient,
    private cookie: CookiesService
  ) { }

  cookie_string = this.cookie.getCookie(this.cookie.cookieName);
  uri = `http://localhost:3000`;

  public getElements() {
    return this.http.get<Element[]>(`${this.uri}/api/${this.cookie_string}/element`);
  }

  public postElement(element: Element): Observable<string[]> {
    console.log(JSON.stringify(element))

    return this.http
      .post<string[]>(`${this.uri}/api/${this.cookie_string}/element`,
                      JSON.stringify({element: element}));
  }

  public postElementById(element: Element) {
    return this.http
      .post(`${this.uri}/api/${this.cookie_string}/element/${element.id}`,
            JSON.stringify({element: element}));
  }
}
