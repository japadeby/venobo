import { Injectable, Inject, forwardRef } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { mapTo, catchError } from 'rxjs/operators';

import { PromiseUtils } from './promise.utils.service';

@Injectable()
export class ObservableUtils {

  // Can't resolve circular dependencies properly using @Inject(forwardRef())
  constructor(
    @Inject(forwardRef(() => PromiseUtils))
    private readonly promiseUtils: PromiseUtils,
  ) {}

  public didComplete<T>(source$: Observable<T>): Observable<boolean> {
    return source$.pipe(
      catchError(() => of(false)),
      mapTo(true),
    );
  }

  public didPromiseResolve(promiseFn: () => Promise<any>): Observable<boolean> {
    return from(this.promiseUtils.didResolve(promiseFn));
  }

}
