import { Component, OnInit, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/htmltags';
import { ElementDirective } from './element.directive';
import { Element } from "../models/element";


@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="template" class="element" #ref=appElement></div>`,
  styleUrls: ['./element.component.css'],
  providers: [
    { provide: Element,
      useExisting: forwardRef(() => ElementComponent)}
  ],
})
export class ElementComponent extends Element implements OnInit, AfterViewInit {
  template: SafeHtml;

  getPosition = () => {
    return (this.directive as ElementDirective).getTransformPosition();
  };

  @ViewChild('ref')
  directive: ElementDirective;

  constructor(
    private sanitized: DomSanitizer
  ) {
    super(HTMLTags.h1, "");
  }

  private signHTML(content: string) : SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(content);
  }

  select() {
    const element = this.directive as ElementDirective;
    element.showElement();
  }

  update() {
    const template =
      `<${this.tag} class="${this.position}">${this.content}</${this.tag}>`;

    this.template = this.signHTML(template);
  }

  reset () {
    this.directive.resetTransformPosition();
  }

  ngOnInit() {
    const template =
      `<${this.tag} class="${this.position}">${this.content}</${this.tag}>`;

    this.template = this.signHTML(template);
  }

  ngAfterViewInit() {
    this.directive.setTransformPosition(this.cords);
  }
}
