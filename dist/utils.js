"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Utils;
(function (Utils) {
    function includes(value, filters) {
        return filters.some(function (filter) { return value.includes(filter); });
    }
    Utils.includes = includes;
    function merge(results) {
        return results.reduce(function (previous, current) { return tslib_1.__spread(previous, current); }, []);
    }
    Utils.merge = merge;
    var promise;
    (function (promise_1) {
        function createFake() {
            var fakeResolve;
            var fakeReject;
            var fakePromise = new Promise(function (resolve, reject) {
                fakeResolve = resolve;
                fakeReject = reject;
            });
            return {
                fakePromise: fakePromise,
                fakeResolve: fakeResolve,
                fakeReject: fakeReject
            };
        }
        promise_1.createFake = createFake;
        /**
         * Resolve an array of promises and race for the first to succeed
         * @author <https://stackoverflow.com/a/37235274>
         * @param {Promise<any>[]} promises
         * @returns {Promise<T>}
         */
        function raceResolve(promises) {
            return Promise.all(promises.map(function (promise) {
                return promise.then(function (val) { return Promise.reject(val); }, function (err) { return Promise.resolve(err); });
            })).then(function (errors) { return Promise.reject(errors); }, function (val) { return Promise.resolve(val); });
        }
        promise_1.raceResolve = raceResolve;
        function didResolve(promise) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, promise()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_1 = _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        promise_1.didResolve = didResolve;
    })(promise = Utils.promise || (Utils.promise = {}));
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=utils.js.map