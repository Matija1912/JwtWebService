import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charLimit'
})
export class CharLimitPipe implements PipeTransform {

  transform(text: string | undefined, textShortenValue: number): string {
    if(text){
      if (text.length > textShortenValue) {
        let txt = text.substring(0, textShortenValue);
        return txt + '...';
      }
      return text;
    }
    return '';
  }

}
