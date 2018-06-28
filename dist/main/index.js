"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_compile_1 = require("electron-compile");
var electron_is_dev_1 = require("electron-is-dev");
var electron_log_1 = require("electron-log");
var main_1 = require("./main");
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var venobo;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (electron_is_dev_1.default) {
                    // HMR for React
                    electron_compile_1.enableLiveReload({ strategy: 'react-hmr' });
                }
                // Enable auto updater
                require('update-electron-app')({
                    repo: 'marcus-sa/venobo',
                    updateInterval: '6 hours',
                    logger: electron_log_1.default,
                });
                venobo = new main_1.Venobo();
                return [4 /*yield*/, venobo.start()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map