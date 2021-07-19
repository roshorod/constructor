import { Injectable } from '@angular/core';
import { Container } from '../models/container';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  container: Container;

  constructor() {
    this.container = new Container();
  }
}
