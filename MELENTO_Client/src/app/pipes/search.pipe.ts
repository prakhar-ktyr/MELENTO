import { Pipe, PipeTransform } from '@angular/core';
import { Assessment } from '../models/assessment';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: Assessment[], searchText: string): Assessment[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.assessmentName.toLowerCase().includes(searchText);
    });
  }
}
