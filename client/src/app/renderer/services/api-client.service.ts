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

  uri = '/api';

  public getElements() {
    return this.http.get<Element[]>(`${this.uri}/${this.cookie_string}/element`);
  }

  public postElement(element: Element): Observable<{id: string}> {
    console.log(JSON.stringify(element))

    return this.http
      .post<{id: string}>(`${this.uri}/${this.cookie_string}/element`,
                      JSON.stringify({element: element}));
  }

  public postElementById(element: Element) {
    return this.http
      .post(`${this.uri}/${this.cookie_string}/element/${element.id}`,
            JSON.stringify({element: element}));
  }
}
