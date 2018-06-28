"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
function ProvideHooks(options) {
    return function (WrappedComponent) {
        var ProviderComponent = /** @class */ (function (_super) {
            tslib_1.__extends(ProviderComponent, _super);
            function ProviderComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    loading: true,
                    error: null,
                    info: null,
                    data: null,
                };
                return _this;
            }
            ProviderComponent.prototype.catchError = function (error, info) {
                if (info === void 0) { info = null; }
                if (options.catchError) {
                    options.catchError(error);
                }
                this.setState({ error: error, info: info });
            };
            ProviderComponent.prototype.createWrappedComponent = function () {
                return React.createElement(WrappedComponent, tslib_1.__assign({}, this.state, this.props));
            };
            ProviderComponent.prototype.componentDidMount = function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var data, error_1;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, options.waitUntil(this.props.dispatch)];
                            case 1:
                                data = _a.sent();
                                this.setState({ data: data, loading: false });
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                this.catchError(error_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            ProviderComponent.prototype.componentDidCatch = function (error, info) {
                this.catchError(error, info);
            };
            ProviderComponent.prototype.render = function () {
                return !this.state.error
                    ? this.state.loading
                        ? options.loadingComponent && React.createElement(options.loadingComponent) || null
                        : this.createWrappedComponent()
                    : options.errorComponent && React.createElement(options.errorComponent, this.state) || null;
            };
            return ProviderComponent;
        }(React.Component));
        return react_redux_1.connect(options.mapStateToProps, function (dispatch) {
            return redux_1.bindActionCreators(options.mapDispatchToProps || {}, dispatch);
        })(ProviderComponent);
    };
}
exports.ProvideHooks = ProvideHooks;
//# sourceMappingURL=ProvideHooks.js.map