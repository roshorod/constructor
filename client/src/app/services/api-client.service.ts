import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Element } from '../models/element';
import { CookiesService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ApiClientSerivce {

  constructor(
    private http: HttpClient,
    private cookie: CookiesService
  ) { }

  public getElement() {
    const cookie = 'BDCTMXvdL08Qysy0yWXfhAjIl2wz_k_GupX7mo5G';
    const uri = `http://localhost:3000`

    return this.http.get<Element>(`${uri}/api/${cookie}/element`);
  }
}
