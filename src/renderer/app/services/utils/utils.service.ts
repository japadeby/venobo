import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

  public includes(value: any, filters: any[]) {
    return filters.some(filter => value.includes(filter));
  }

  public merge<T>(results: T[][]): T[] {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

}
