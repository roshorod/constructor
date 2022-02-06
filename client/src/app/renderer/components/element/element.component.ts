import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { Element } from "@renderer/models/element";
import { LocalStoreService } from "@services/localstore.service";

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

  @HostBinding('style.background') image: string;
  @HostBinding('style.background-size') imageSize: string;

  constructor(private local: LocalStoreService) {}

  ngOnInit() {
    Object.assign(this, { ...this.payload });

    if (this.payload.image) {
      this.local.getValue(this.payload.image)
        .then(image => {
          this.image = `url(${image}) no-repeat`;
          this.imageSize = 'cover';
        });
    }

  }
}
