"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_router_1 = require("mobx-react-router");
var electron_1 = require("electron");
var events_1 = require("../events");
var metadata_1 = require("../api/metadata");
var torrent_1 = require("../api/torrent");
var i18n_1 = require("../i18n");
var config_store_1 = require("./stores/config.store");
var stores_1 = require("./stores");
var app_1 = require("./app");
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var configStore, config, torrentAdapter, metadataAdapter, stores, history;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configStore = new config_store_1.ConfigStore();
                return [4 /*yield*/, configStore.load()];
            case 1:
                config = _a.sent();
                /*const i18n = */ i18n_1.createI18n(config.user.prefs.ietf);
                torrentAdapter = new torrent_1.TorrentAdapter();
                metadataAdapter = new metadata_1.MetadataAdapter(torrentAdapter, config);
                stores = stores_1.createStores(metadataAdapter);
                history = mobx_react_router_1.syncHistoryWithStore(config.user.history, stores.router);
                stores.config = config;
                return [4 /*yield*/, torrentAdapter.createProviders()];
            case 2:
                _a.sent();
                return [4 /*yield*/, app_1.createApp(stores, history)];
            case 3:
                _a.sent();
                // Tell the main process that the render has finished
                // so it can show this window instead of the loading one
                electron_1.ipcRenderer.emit(events_1.RENDERER_FINISHED_LOADING);
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map