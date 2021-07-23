import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTMLTags } from '../models/htmltags';
import { ContainerService } from '../services/container.service';
import { ElementDirective } from './element.directive';

@Component({
  selector: 'app-element',
  template: `<div [innerHTML]="template" class="element" #ref=appElement></div>`,
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  template: SafeHtml | undefined;

  content: string = 'test';
  tag: HTMLTags | undefined;

  getPosition = () => {
    return (this.directive as ElementDirective).getTransformPosition();
  };

  @ViewChild('ref')
  directive: ElementDirective | undefined;

  constructor(
    private sanitized: DomSanitizer,
    private container: ContainerService
  ) { }

  private signHTML(content: string) : SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(content);
  }

  select() {
    this.container.selectedComponent = this;
    const element = this.directive as ElementDirective;
    element.showElement();
  }

  ngOnInit() {
    const template = `<${this.tag}>${this.content}</${this.tag}>`;

    this.template = this.signHTML(template);
  }
}
