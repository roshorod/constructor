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

  public getElements(
    uri: string = `${this.uri}/${this.cookie_string}/element`
  ): Observable<Element[]> {
    return this.http.get<Element[]>(uri);
  }

  public getElement(
    id: string,
    uri: string = `${this.uri}/${this.cookie_string}/element/${id}`
  ): Observable<Element> {
    return this.http.get<Element>(uri);
  }

  public postElement(
    element: Element,
    uri: string = `${this.uri}/${this.cookie_string}/element`
  ): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(uri, JSON.stringify({ element: element }));
  }

  public postElementById(
    element: Element,
    uri: string = `${this.uri}/${this.cookie_string}/element/${element.id}`
  ) {
    return this.http
      .post<Element>(uri, JSON.stringify({ element: element }));
  }

  public deleteElement(
    element: Element,
    uri: string = `${this.uri}/${this.cookie_string}/element/${element.id}`
  ) {
    return this.http.delete<Element>(uri);
  }
}
