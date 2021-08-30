import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/htmltags';
import { SpawnPosition } from '../models/settings';
import { ElementDirective } from './element.directive';

@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="template" class="element" #ref=appElement></div>`,
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  template: SafeHtml;

  content: string = 'test';
  tag: HTMLTags;

  grid: SpawnPosition = SpawnPosition.center;

  getPosition = () => {
    return (this.directive as ElementDirective).getTransformPosition();
  };

  @ViewChild('ref')
  directive: ElementDirective;

  constructor(
    private sanitized: DomSanitizer
  ) { }

  private signHTML(content: string) : SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(content);
  }

  select() {
    const element = this.directive as ElementDirective;
    element.showElement();
  }

  update() {
    const template = `<${this.tag}>${this.content}</${this.tag}>`;
    this.template = this.signHTML(template);
  }

  reset () {
    (this.directive as ElementDirective).resetPosition();
  }

  ngOnInit() {
    const template = `<${this.tag}>${this.content}</${this.tag}>`;
    this.template = this.signHTML(template);
  }
}
