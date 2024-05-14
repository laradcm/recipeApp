import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    const limit = args.length > 0 ? args[0] : value.length;
    const elipsis = '...';
    return value.length > limit ? value.slice(0, limit) + elipsis : value || '';
  }
}
