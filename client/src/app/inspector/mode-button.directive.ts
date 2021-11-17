import { Directive, ElementRef, Input, OnChanges } from "@angular/core";
import { RendererMode } from "@renderer/models/mode";

@Directive({
  selector: '[mode-button]'
})
export class ModeButtonDirective implements OnChanges {
  @Input() target: RendererMode;
  @Input() mode: RendererMode;

  constructor(private elemRef: ElementRef) { }

  ngOnChanges() {
    if (this.target == this.mode)
      this.elemRef.nativeElement.style = "background:  #d65d0e;";
    else
      this.elemRef.nativeElement.style = "";
  }
}
