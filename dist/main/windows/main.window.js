"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_devtools_installer_1 = require("electron-devtools-installer");
var electron_is_dev_1 = require("electron-is-dev");
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var MainWindow;
(function (MainWindow) {
    function create() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mainWindow, startUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mainWindow = new electron_1.BrowserWindow({
                            width: 800,
                            height: 600,
                            show: electron_is_dev_1.default,
                            titleBarStyle: 'hiddenInset',
                            useContentSize: true,
                        });
                        startUrl = url.format({
                            pathname: path.join(__dirname, '..', '..', '..', 'static', 'index.html'),
                            protocol: 'file:',
                            slashes: true,
                        });
                        mainWindow.loadURL(startUrl);
                        if (!electron_is_dev_1.default) return [3 /*break*/, 2];
                        return [4 /*yield*/, electron_devtools_installer_1.default(electron_devtools_installer_1.REACT_DEVELOPER_TOOLS)];
                    case 1:
                        _a.sent();
                        mainWindow.webContents.openDevTools({ mode: 'detach' });
                        _a.label = 2;
                    case 2: return [2 /*return*/, mainWindow];
                }
            });
        });
    }
    MainWindow.create = create;
})(MainWindow = exports.MainWindow || (exports.MainWindow = {}));
//# sourceMappingURL=main.window.js.map