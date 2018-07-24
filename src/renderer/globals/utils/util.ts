// import { Injectable } from '@angular/core';

// @Injectable()
export abstract class Utils {

  public static includes(value: any, filters: any[]) {
    return filters.some(filter => value.includes(filter));
  }

  public static merge<T>(results: T[][]): T[] {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

}
