// import { Injectable } from '@angular/core';

// @Injectable()
export abstract class Utils {

  public static includes(value: any, filters: any[]) {
    return filters.some(filter => value.includes(filter));
  }

  public static merge<T>(results: T[][]): T[] {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

  public static slugify(str: string) {
    str = str.replace(/[A-Z]/g, (s) => ' ' + s).toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0; i < from.length; i++) {
      str = str.replace(from[i], to[i]);
    }

    return str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^[\s|-]+|[\s|-]+$/g, ''); // Trim leading and trailing whitespace and dashes.
  }

}
