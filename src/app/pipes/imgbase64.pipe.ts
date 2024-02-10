import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgbase64'
})
export class Imgbase64Pipe implements PipeTransform {

  transform(value: any, contentType: string): any {
    var base64Content = `data:${contentType};base64,${value}`;
    return base64Content;
  }

}
