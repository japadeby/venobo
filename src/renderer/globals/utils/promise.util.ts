// import { forwardRef, Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { ObservableUtils } from './observable.util';

export interface IDefferedPromise {
  fakePromise: Promise<any>;
  fakeResolve?: () => any;
  fakeReject?: () => any;
}

// @Injectable()
export abstract class PromiseUtils {

  /*constructor(
    @Inject(forwardRef(() => ObservableUtils))
    private readonly observableUtils: ObservableUtils,
  ) {}*/

  public static deferred(): IDefferedPromise {
    let fakeResolve;
    let fakeReject;

    const fakePromise = new Promise((resolve, reject) => {
      fakeResolve = resolve;
      fakeReject = reject;
    });

    return {
      fakePromise,
      fakeResolve,
      fakeReject
    };
  }

  /**
   * Resolve an array of promises and race for the first to succeed
   * @author <https://stackoverflow.com/a/37235274>
   * @param {Promise<any>[]} promises
   * @returns {Promise<T>}
   */
  public static raceResolve<T>(promises: Promise<any>[]): Promise<T> {
    return <any>Promise.all(promises.map(promise => {
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

  public static didObservableResolve(source$: Observable<any>): Promise<boolean> {
    return ObservableUtils.didComplete(source$).toPromise();
  }

}
