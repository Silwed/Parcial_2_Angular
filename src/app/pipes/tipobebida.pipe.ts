import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipobebida'
})
export class TipobebidaPipe implements PipeTransform {

  transform(value: number,args ?: any): string {
    if(value == 1)
    return 'Alcoholica';
    else
    return 'No Alcoholica';
  }

}
