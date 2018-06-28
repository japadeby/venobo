"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fse = require("fs-extra");
var config_store_1 = require("./config.store");
describe('ConfigStore', function () {
    var configStore = new config_store_1.ConfigStore();
    var configPath = configStore.getConfigFilePath();
    it('should load config', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var config;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = configStore.load();
                    return [4 /*yield*/, expect(config).resolves.toBeCalled()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(fse.pathExists(configPath)).resolves.toBeCalled()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should truncate config', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configStore.trash()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(fse.pathExists(configPath)).rejects.toBeCalled()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=config.store.test.js.map