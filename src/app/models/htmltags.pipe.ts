import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlTags'
})
export class HTMLTagsPipe implements PipeTransform {
  transform(data: Object) {
    const keys = Object.keys(data);
    return keys;
  }

}
