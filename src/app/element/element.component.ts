import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/HTMLTags';

@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="content" class="element"></div>`,
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  content: SafeHtml | undefined;
  tag: HTMLTags | undefined;
  style: string | undefined;

  constructor(
    protected sanitized: DomSanitizer,
  ) { }

  signHTML(content: string) : SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(content);
  }

  ngOnInit() {
    const template = `<${this.tag} style="${this.style}">test</${this.tag}>`;

    this.content = this.signHTML(template);
  }
}
