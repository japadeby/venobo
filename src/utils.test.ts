import { Utils } from './utils';

describe('Utils', () => {
  /*it('should merge arrays', () => {

  });*/
  it('should race for first successful promise', () => {
    const promises = [
      Promise.reject(null),
      new Promise(resolve => setTimeout(() => resolve('FIRST'), 1))
    ];

    const race = Utils.promiseRaceSuccess<string>(promises);
    return expect(race).resolves.toEqual('FIRST');
  });
});