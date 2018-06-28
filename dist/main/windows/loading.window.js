"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var LoadingWindow;
(function (LoadingWindow) {
    function create() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loadingWindow, startUrl;
            return tslib_1.__generator(this, function (_a) {
                loadingWindow = new electron_1.BrowserWindow({
                    width: 800,
                    height: 600,
                    titleBarStyle: 'hiddenInset',
                    useContentSize: true,
                    frame: false,
                    movable: true,
                    resizable: false,
                    closable: false,
                    alwaysOnTop: true,
                });
                startUrl = url.format({
                    pathname: path.join(__dirname, '..', '..', '..', 'static', 'loading.html'),
                    protocol: 'file:',
                    slashes: true,
                });
                loadingWindow.loadURL(startUrl);
                return [2 /*return*/, loadingWindow];
            });
        });
    }
    LoadingWindow.create = create;
})(LoadingWindow = exports.LoadingWindow || (exports.LoadingWindow = {}));
//# sourceMappingURL=loading.window.js.map