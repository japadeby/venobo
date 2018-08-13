import { from, Observable, of } from 'rxjs';
import { mapTo, catchError } from 'rxjs/operators';

import { PromiseUtils } from './promise.util';

export abstract class ObservableUtils {

  public static didComplete<T>(source$: Observable<T>): Observable<boolean> {
    return source$.pipe(
      catchError(() => of(false)),
      mapTo(true),
    );
  }

  public static didPromiseResolve(promiseFn: () => Promise<any>) {
    return from(PromiseUtils.didResolve(promiseFn));
  }

}
