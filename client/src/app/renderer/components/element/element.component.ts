import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { Element } from "@renderer/models/element";

@Component({
  selector: '.element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css'],
})
export class ElementComponent implements OnInit {
  @Input() payload: Element;

  /**
   * @summary Host binding variables name must be like in `Element' type.
   */
  @HostBinding('style.color') color: string;
  @HostBinding('style.background-color') background: string;

  ngOnInit() {
    Object.assign(this, { ...this.payload });
  }
}
