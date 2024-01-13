import {Pipe, PipeTransform} from "@angular/core";
import {pipe} from "rxjs";

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: any): any {
    return value.substring(0, 10) + '...';
  }
}
