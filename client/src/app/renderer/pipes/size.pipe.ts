import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { Size } from "@renderer/models/units";

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(size: Size[]): SafeStyle {
    if ((size?.length ?? 0) === 0)
      size = [{ size: 1, pxType: 'fr' }];

    return this.sanitizer.bypassSecurityTrustStyle(size.map(
      s => s.size + s.pxType).join(' '));
  }
}
