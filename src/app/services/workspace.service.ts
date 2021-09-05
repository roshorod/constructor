import { DOCUMENT } from '@angular/common';
import { Element } from './../models/element';
import { Inject, Injectable } from '@angular/core';
import { SpawnPosition } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  project: Document;
  title: string = "MyTitle"
  projectBody: HTMLElement;
  projectStyle: HTMLElement;
  projectGrid: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.project = document.implementation.createHTMLDocument(this.title);
    this.projectBody = this.project.body;
    this.projectStyle = this.project.createElement('style');
    this.projectGrid = this.project.createElement('div');

    this.projectBody.appendChild(this.projectStyle);
    this.projectBody.appendChild(this.projectGrid);

    this.projectStyle.innerHTML = `
html, body {
  box-sizing: border-box;
}

.content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 10fr 1fr;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas: "top top top"
                       "left center right"
                       "bottom bottom bottom";
}
.top {
  grid-area: top;
}
.top > * {
  width: max-content;
  height: max-content;
  position: absolute;
}
.left {
  grid-area: left;
}
.left > * {
  width: max-content;
  height: max-content;
  position: absolute;
}
.right {
  grid-area: right;
}
.right > * {
  width: max-content;
  height: max-content;
  position: absolute;
}
.center {
  grid-area: center;
}
.center > * {
  width: max-content;
  height: max-content;
  position: absolute;
}
.bottom {
  grid-area: bottom;
}
.bottom > * {
  width: max-content;
  height: max-content;
  position: absolute;
}
 `;

    this.projectGrid.className = 'content';
    this.projectGrid.innerHTML = `
<div class="top" id="top"></div>
<div class="left" id="left"></div>
<div class="center" id="center"></div>
<div class="right" id="right"></div>
<div class="bottom" id="bottom"></div>
`;
  }

  loadProjectOnScreen(elements: Element[]) {
    elements.forEach(ref => {
      const component = ref.component.instance;
      this.createElement(component.tag as string,
                         component.content as string,
                         component.getPosition(),
                         component.position)});

    this.document.body.innerHTML = this.projectBody.innerHTML;
  }

  private createElement(tag: string,
                        content: string,
                        transform: string,
                        gridPosition: SpawnPosition) {
    const node = this.project.createElement(tag);
    node.textContent = content;
    node.style.transform = transform;

    const grid = this.project.getElementById(gridPosition) as HTMLElement;
    grid.appendChild(node)
  }
}
