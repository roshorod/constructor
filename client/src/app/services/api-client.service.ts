import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Element } from '../models/element';
import { CookiesService } from './cookie.service';
import { SpawnPosition } from '../models/settings';

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

  public postElement(
    tag: string,
    content: string = "Initial",
    spawnPosition: SpawnPosition = SpawnPosition.center) {
    const json = {element:{tag: tag,
                           content: content,
                           spawnPosition: spawnPosition}};
    return this.http
      .post(`${this.uri}/api/${this.cookie_string}/element`, JSON.stringify(json));
  }
}
