import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(options: any, parameters: any): any {
    return options.filter(option => option.type === parameters.type
                                    && option.region === parameters.region);
  }

}
