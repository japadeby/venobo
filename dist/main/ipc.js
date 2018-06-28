"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var external_player_1 = require("./external-player");
var events_1 = require("../events");
function setupIpcListeners(venobo) {
    var _this = this;
    var externalPlayer = new external_player_1.ExternalPlayer(venobo, '');
    electron_1.ipcMain.once(events_1.IPC_READY, function () {
        venobo.ipcReady = true;
        electron_1.app.emit(events_1.IPC_READY);
    });
    electron_1.ipcMain.on(events_1.APP_QUIT, function () { return electron_1.app.quit(); });
    // Renderer
    electron_1.ipcMain.on(events_1.RENDERER_FINISHED_PRELOADING, function () {
        console.log(events_1.RENDERER_FINISHED_PRELOADING);
        venobo.mainWindow.show();
        venobo.loadingWindow.close();
    });
    /*ipcMain.on(ON_PLAYER_OPEN, () => {
  
    });
  
    ipcMain.on(ON_PLAYER_CLOSE, () => {
  
    });*/
    /**
     * Shell
     */
    /**
     * External media player
     */
    electron_1.ipcMain.on(events_1.CHECK_FOR_EXTERNAL_PLAYER, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, externalPlayer.checkInstall()];
                case 1:
                    error = _a.sent();
                    venobo.mainWindow.emit(events_1.CHECK_FOR_EXTERNAL_PLAYER, !error);
                    return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on(events_1.QUIT_EXTERNAL_PLAYER, function () { return externalPlayer.kill(); });
}
exports.setupIpcListeners = setupIpcListeners;
//# sourceMappingURL=ipc.js.map