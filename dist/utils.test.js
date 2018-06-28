"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
describe('Utils', function () {
    describe('promise', function () {
        describe('didResolve', function () {
            it('should be true for resolve', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var promise, didResolve;
                return tslib_1.__generator(this, function (_a) {
                    promise = Promise.resolve();
                    didResolve = utils_1.Utils.promise.didResolve(function () { return promise; });
                    return [2 /*return*/, expect(didResolve).resolves.toEqual(true)];
                });
            }); });
            it('should be false for reject', function () {
                var promise = Promise.reject(null);
                var didResolve = utils_1.Utils.promise.didResolve(function () { return promise; });
                return expect(didResolve).resolves.toEqual(false);
            });
        });
        describe('raceResolve', function () {
            it('should race for first successful promise', function () {
                var promises = [
                    Promise.reject(1),
                    new Promise(function (resolve) {
                        return setTimeout(function () { return resolve(2); }, 5);
                    }),
                    Promise.reject(3),
                    Promise.resolve(4),
                ];
                var promiseRace = utils_1.Utils.promise.raceResolve(promises);
                return expect(promiseRace).resolves.toEqual(4);
            });
        });
    });
});
//# sourceMappingURL=utils.test.js.map