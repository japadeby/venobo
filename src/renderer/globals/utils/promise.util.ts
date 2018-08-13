import { Observable } from 'rxjs';

import { ObservableUtils } from './observable.util';

export interface IDeferredPromise {
  promise?: Promise<any>;
  resolve?: () => any;
  reject?: () => any;
}

export abstract class PromiseUtils {

  public static deferred() {
    const deferred: IDeferredPromise = {};

    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    return deferred;
  }

  /**
   * Resolve an array of promises and race for the first to succeed
   * @author <https://stackoverflow.com/a/37235274>
   * @param {Promise<any>[]} promises
   * @returns {Promise<T>}
   */
  public static raceResolve<T>(promises: Promise<any>[]): Promise<T> {
    return <T>Promise.all(promises.map(promise => {
      return promise.then(
        val => Promise.reject(val),
        err => Promise.resolve(err),
      );
    })).then(
      errors => Promise.reject(errors),
      val => Promise.resolve(val),
    );
  }

  public static filterResolved<F>(from: F[], to: boolean[]): F[] {
    return from
      .map((x, i) => [x, to[i]])
      .filter(provider => !!provider[1])
      .map(a => a.shift()) as F[];
  }

  public static async didResolve(promiseFn: () => Promise<any>) {
    try {
      await promiseFn();

      return true;
    } catch (e) {
      return false;
    }
  }

  public static didObservableResolve(source$: Observable<any>) {
    return ObservableUtils.didComplete(source$).toPromise();
  }

}
