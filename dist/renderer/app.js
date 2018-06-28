"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var mobx_react_1 = require("mobx-react");
var ReactDOM = require("react-dom");
var react_router_config_1 = require("react-router-config");
var react_router_1 = require("react-router");
var react_hot_loader_1 = require("react-hot-loader");
function createApp(stores, history) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var render;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var routes;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('./routes'); })];
                                case 1:
                                    routes = (_a.sent()).routes;
                                    ReactDOM.render(React.createElement(react_hot_loader_1.AppContainer, null,
                                        React.createElement(mobx_react_1.Provider, tslib_1.__assign({}, stores),
                                            React.createElement(react_router_1.Router, { history: history }, react_router_config_1.renderRoutes(routes)))), document.getElementById('app'));
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, render()];
                case 1:
                    _a.sent();
                    if (module.hot) {
                        module.hot.accept(render);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.createApp = createApp;
//# sourceMappingURL=app.js.map