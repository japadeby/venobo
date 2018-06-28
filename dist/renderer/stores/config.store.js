"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var history_1 = require("history");
var application_config_path_1 = require("application-config-path");
var electron_is_dev_1 = require("electron-is-dev");
var path = require("path");
var fse = require("fs-extra");
var os = require("os");
var database_1 = require("../../database");
var pckg = require("../../../package.json");
var ConfigStore = /** @class */ (function () {
    function ConfigStore() {
        this.getDefaultConfig = function () { return ({
            userId: os.hostname(),
            version: pckg.version,
        }); };
        // This should be saved in the database
        this.getDefaultUserConfig = function () { return ({
            id: os.hostname(),
            prefs: {
                defaultQuality: '1080p',
                language: 'en',
                ietf: 'en-US',
            },
            history: history_1.createMemoryHistory(),
            starred: {
                movies: [],
                shows: [],
            },
            watched: {
                movies: [],
                shows: [],
            },
        }); };
    }
    ConfigStore.prototype.getTempPath = function () {
        return process.platform === 'win32'
            ? 'C:\\Windows\\Temp'
            : '/tmp';
    };
    ConfigStore.prototype.getConfigPath = function () {
        return electron_is_dev_1.default
            ? path.join(this.getTempPath(), pckg.productName)
            : application_config_path_1.default(pckg.productName);
    };
    ConfigStore.prototype.getConfigFilePath = function () {
        return path.join(this.getConfigPath(), 'config.json');
    };
    ConfigStore.prototype.trash = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, fse.rmdir(this.getConfigPath())];
            });
        });
    };
    ConfigStore.prototype.load = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var configPath, config, user, e_1, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configPath = this.getConfigFilePath();
                        return [4 /*yield*/, fse.ensureDir(configPath)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, fse.readJson(configPath)];
                    case 3:
                        config = _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        config = this.getDefaultConfig();
                        return [4 /*yield*/, fse.writeJson(configPath, config)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _a.trys.push([6, 8, , 10]);
                        return [4 /*yield*/, database_1.Database.findOne('users', {
                                selector: { id: config.id },
                            })];
                    case 7:
                        user = _a.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        e_2 = _a.sent();
                        user = this.getDefaultUserConfig();
                        return [4 /*yield*/, database_1.Database.users.put(user)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, tslib_1.__assign({}, config, { user: user })];
                }
            });
        });
    };
    return ConfigStore;
}());
exports.ConfigStore = ConfigStore;
//# sourceMappingURL=config.store.js.map