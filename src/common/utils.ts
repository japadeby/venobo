export namespace Utils {

  export function includes(value: any, filters: any[]) {
    return filters.some(filter => value.includes(filter));
  }

  export function merge<T>(results: T[][]): T[] {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

  export namespace promise {

    export interface IFakePromise {
      fakePromise: Promise<any>;
      fakeResolve?: () => any;
      fakeReject?: () => any;
    }

    export function createFake(): IFakePromise {
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
    export function raceResolve<T>(promises: Promise<any>[]): Promise<T> {
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

    export function filterResolved<F>(from: F[], to: boolean[]): F[] {
      return from
        .map((x, i) => [x, to[i]])
        .filter(provider => !!provider[1])
        .map(a => a.shift()) as F[];
    }

    export async function didResolve(promise: () => Promise<any>) {
      try {
        await promise();

        return true;
      } catch (e) {
        return false;
      }
    }

  }

}