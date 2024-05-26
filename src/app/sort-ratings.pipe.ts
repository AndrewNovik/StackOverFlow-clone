import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortRatings'
})
export class SortRatingsPipe implements PipeTransform {
  transform(arr: any[]):any[] {
      for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[min].rate < arr[j].rate) {
            min = j; // Меняем значение переменной на наибольшее значение
          }
        }
        [arr[i], arr[min]] = [arr[min], arr[i]]; // Меняем значения переменных
      }
      return arr
    };
}
