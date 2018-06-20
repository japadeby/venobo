export namespace Utils {

  export function includes(value: any, filters: any[]) {
    return filters.some(filter => value.includes(filter));
  }

  export function merge(results: any[]) {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

  /**
   * Resolve an array of promises and race for the first to succeed
   * @author <https://stackoverflow.com/a/37235274>
   * @param {Promise<any>[]} promises
   * @returns {Promise<T>}
   */
  export function promiseRaceSuccess<T>(promises: Promise<any>[]): Promise<T> {
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

  export async function promiseTryCatch(promise: () => Promise<any>) {
    try {
      await promise();

      return true;
    } catch (e) {
      return false;
    }
  }

}
