import { DOCUMENT } from '@angular/common';
import { Element } from './../models/element';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  project: Document;
  title: string = "MyTitle"
  projectBody: HTMLElement;
  projectStyle: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.project = document.implementation.createHTMLDocument(this.title);
    this.projectBody = this.project.body;
    this.projectStyle = this.project.createElement('style');
    this.projectBody.appendChild(this.projectStyle);

    this.projectStyle.innerHTML = "h1 { margin: 10px; }"
  }

  loadProjectOnScreen(elements: Element[]) {
    elements.forEach(ref => {
      const component = ref.component.instance;
      this.createElement(component.tag as string,
                         component.content as string,
                         component.getPosition())});

    this.document.body.innerHTML = this.projectBody.innerHTML;
  }

  private createElement(tag: string, content: string, transform: string) {
    const node = this.project.createElement(tag);
    node.textContent = content;
    node.style.transform = transform;

    this.projectBody.appendChild(node);
  }
}
