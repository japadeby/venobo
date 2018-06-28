"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var enzyme_1 = require("enzyme");
var redux_mock_store_1 = require("redux-mock-store");
var ProvideHooks_1 = require("./ProvideHooks");
var utils_1 = require("../../utils");
describe('ProvideHooks', function () {
    var mockStore = redux_mock_store_1.default();
    var store;
    beforeEach(function () {
        store = mockStore();
    });
    it('should test', function () {
        var mockLoadingFn = utils_1.Utils.promise.createFake();
        var loadingText = 'Loading...';
        var homeText = 'Welcome to Home!';
        mockLoadingFn.fakePromise.then(function () { return console.log('FINALLY!!'); });
        var Home = /** @class */ (function (_super) {
            tslib_1.__extends(Home, _super);
            function Home() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Home.prototype.render = function () {
                return (React.createElement("div", null, homeText));
            };
            Home = tslib_1.__decorate([
                ProvideHooks_1.ProvideHooks({
                    catchError: console.dir,
                    waitUntil: function () {
                        setTimeout(mockLoadingFn.fakeResolve, 100);
                        return mockLoadingFn.fakePromise;
                    },
                    loadingComponent: function () { return React.createElement("div", null, loadingText); },
                })
            ], Home);
            return Home;
        }(React.Component));
        var wrapper = enzyme_1.mount(React.createElement(Home, { store: store }));
        expect(wrapper.text()).toEqual(loadingText);
        return expect(mockLoadingFn.fakePromise.then(function () {
            wrapper.update();
            return wrapper.text();
        })).resolves.toEqual(homeText);
    });
});
//# sourceMappingURL=ProvideHooks.test.js.map