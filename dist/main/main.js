"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var windows_1 = require("./windows");
var ipc_1 = require("./ipc");
var Venobo = /** @class */ (function () {
    function Venobo() {
        this.shouldQuit = false;
        //public isReady: boolean = false;
        this.ipcReady = false;
        this.shouldQuit = electron_1.app.makeSingleInstance(function () { return null; });
    }
    Venobo.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (this.shouldQuit)
                    return [2 /*return*/, electron_1.app.quit()];
                process.on('uncaughtException', function (err) {
                    console.error(err);
                    _this.mainWindow.emit('uncaughtError', err);
                });
                electron_1.app.on('ready', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = this;
                                return [4 /*yield*/, windows_1.MainWindow.create()];
                            case 1:
                                _a.mainWindow = _c.sent();
                                _b = this;
                                return [4 /*yield*/, windows_1.LoadingWindow.create()];
                            case 2:
                                _b.loadingWindow = _c.sent();
                                ipc_1.setupIpcListeners(this);
                                return [2 /*return*/];
                        }
                    });
                }); });
                electron_1.app.on('activate', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!!this.loadingWindow) return [3 /*break*/, 2];
                                _a = this;
                                return [4 /*yield*/, windows_1.LoadingWindow.create()];
                            case 1:
                                _a.loadingWindow = _c.sent();
                                _c.label = 2;
                            case 2:
                                if (!!this.mainWindow) return [3 /*break*/, 4];
                                _b = this;
                                return [4 /*yield*/, windows_1.MainWindow.create()];
                            case 3:
                                _b.mainWindow = _c.sent();
                                _c.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                electron_1.app.on('window-all-closed', function () {
                    if (process.platform !== 'darwin') {
                        electron_1.app.quit();
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return Venobo;
}());
exports.Venobo = Venobo;
//# sourceMappingURL=main.js.map