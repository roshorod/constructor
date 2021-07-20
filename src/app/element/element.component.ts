import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/HTMLTags';
import { ElementDirective } from './element.directive';

@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="content" class="element" #ref=appElement></div>`,
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  content: SafeHtml | undefined;
  tag: HTMLTags | undefined;
  style: string | undefined;

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
    const template = `<${this.tag} style="${this.style}">test</${this.tag}>`;

    this.content = this.signHTML(template);
  }
}
