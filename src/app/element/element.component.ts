import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/HTMLTags';
import { ElementDirective } from './element.directive';

@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="template" class="element" #ref=appElement></div>`,
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  template: SafeHtml | undefined;

  content: string | undefined = 'test';
  tag: HTMLTags | undefined;
  style: string | undefined;

  getPosition = () => {
    return (this.directive as ElementDirective).getTransformPosition();
  };

  @ViewChild('ref')
  directive: ElementDirective | undefined;

  constructor(
    private sanitized: DomSanitizer,
  ) { }

  private signHTML(content: string) : SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(content);
  }

  select() {
    const element = this.directive as ElementDirective;

    element.showElement();
  }

  ngOnInit() {
    const template = `<${this.tag} style="${this.style}">${this.content}</${this.tag}>`;

    this.template = this.signHTML(template);
  }
}
