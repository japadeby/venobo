// import { Injectable, Inject, forwardRef } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { mapTo, catchError } from 'rxjs/operators';

import { PromiseUtils } from './promise.util';

// @Injectable()
export abstract class ObservableUtils {

  // Can't resolve circular dependencies properly using @Inject(forwardRef())
  /*constructor(
    @Inject(forwardRef(() => PromiseUtils))
    private readonly promiseUtils: PromiseUtils,
  ) {}*/

  public static didComplete<T>(source$: Observable<T>): Observable<boolean> {
    return source$.pipe(
      catchError(() => of(false)),
      mapTo(true),
    );
  }

  public static didPromiseResolve(promiseFn: () => Promise<any>): Observable<boolean> {
    return from(PromiseUtils.didResolve(promiseFn));
  }

}
