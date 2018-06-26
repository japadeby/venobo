import { Utils } from './utils';

describe('Utils', () => {
  describe('promise', () => {
    describe('didResolve', () => {
      it('should be true for resolve', async () => {
        const promise = Promise.resolve();

        const didResolve = Utils.promise.didResolve(() => promise);
        return expect(didResolve).resolves.toEqual(true);
      });

      it('should be false for reject', () => {
        const promise = Promise.reject(null);

        const didResolve = Utils.promise.didResolve(() => promise);
        return expect(didResolve).resolves.toEqual(false);
      });
    });

    describe('raceResolve', () => {
      it('should race for first successful promise', () => {
        const promises = [
          Promise.reject(1),
          new Promise(resolve => {
            return setTimeout(() => resolve(2), 5);
          }),
          Promise.reject(3),
          Promise.resolve(4),
        ];

        const promiseRace = Utils.promise.raceResolve<number>(promises);
        return expect(promiseRace).resolves.toEqual(4);
      });
    });
  });
});