import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { Position } from "@renderer/models/position";

@Pipe({
  name: 'gridArea'
})
export class GridAreaPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(position: Position): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`${(position.cellY + 1)} / ${(position.cellX + 1)} / ${position.cellY + position.height + 1} / ${position.cellX + position.width + 1}`);
  }
}
