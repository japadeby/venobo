"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path = require("path");
var vlcCommand = require("vlc-command");
var events_1 = require("../events");
var ExternalPlayer = /** @class */ (function () {
    function ExternalPlayer(venobo, playerPath) {
        this.venobo = venobo;
        this.playerPath = playerPath;
        this.proc = null;
    }
    ExternalPlayer.prototype.checkInstall = function () {
        var _this = this;
        // check for VLC if external player has not been specified by the user
        // otherwise assume the player is installed
        return new Promise(function (resolve) {
            if (!_this.playerPath)
                return vlcCommand(resolve);
            process.nextTick(function () { return resolve(); });
        });
    };
    ExternalPlayer.prototype.spawn = function (url, title) {
        var _this = this;
        if (!this.playerPath)
            return this.spawnExternal([url]);
        // Try to find and use VLC if external player is not specified
        vlcCommand(function (err, vlcPath) {
            if (err)
                return _this.venobo.mainWindow.emit(events_1.EXTERNAL_PLAYER_NOT_FOUND);
            return _this.spawnExternal([
                '--play-and-exit',
                '--video-on-top',
                '--quiet',
                "--meta-title=" + JSON.stringify(title)
            ], vlcPath);
        });
    };
    ExternalPlayer.prototype.kill = function () {
        if (!this.proc)
            return;
        this.proc.kill('SIGKILL');
        this.proc = null;
    };
    ExternalPlayer.prototype.spawnExternal = function (args, playerPath) {
        var _this = this;
        if (playerPath === void 0) { playerPath = this.playerPath; }
        if (process.platform === 'darwin' && path.extname(playerPath) === '.app') {
            // Mac: Use executable in packaged .app bundle
            playerPath += '/Contents/MacOS/' + path.basename(playerPath, '.app');
        }
        this.proc = child_process_1.spawn(playerPath, args, { stdio: 'ignore' });
        // If it works, close the modal after a second
        var closeModal = this.closeModalTimeout();
        this.proc.on('close', function (code) {
            clearTimeout(closeModal);
            if (!_this.proc)
                return;
            _this.proc = null;
            return code === 0
                ? _this.venobo.mainWindow.emit('backToList')
                : _this.venobo.mainWindow.emit(events_1.EXTERNAL_PLAYER_NOT_FOUND);
        });
    };
    ExternalPlayer.prototype.closeModalTimeout = function () {
        var _this = this;
        return setTimeout(function () {
            _this.venobo.mainWindow.emit('exitModal');
        }, 1000);
    };
    return ExternalPlayer;
}());
exports.ExternalPlayer = ExternalPlayer;
//# sourceMappingURL=external-player.js.map