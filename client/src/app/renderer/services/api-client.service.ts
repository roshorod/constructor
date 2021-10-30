import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Element } from '@element/models/element';
import { SpawnPosition } from '@element/models/spawn-positions';

import { CookiesService } from '@services/cookie.service';
import { RendererModule } from '@renderer/renderer.module';

@Injectable()
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
    const json = {
      element: {
        tag: tag,
        content: content,
        spawnPosition: spawnPosition
      }
    };

    return this.http
      .post<string[]>(`${this.uri}/api/${this.cookie_string}/element`,
            JSON.stringify(json));
  }

  public postElementById(element: Element) {
    const elementDirective = element.component.instance.directive;

    const json = {
      element: {
        tag: element.tag,
        content: element.content,
        spawnPosition: element.position,
        id: element.id,
        cords: {
          x: elementDirective.currentX,
          y: elementDirective.currentY
        }
      }
    };

    return this.http
      .post(`${this.uri}/api/${this.cookie_string}/element/${element.id}`,
            JSON.stringify(json));
  }
}
