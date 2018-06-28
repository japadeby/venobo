"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var provider_utils_1 = require("./provider-utils");
var utils_1 = require("../../utils");
var constants_1 = require("../../constants");
var providers_1 = require("./providers");
var TorrentAdapter = /** @class */ (function () {
    function TorrentAdapter() {
        this.allProviders = [
            //new iDopeTorrentProvider(),
            new providers_1.YtsTorrentProvider(),
            new providers_1.ThePirateBayTorrentProvider(),
            new providers_1.KickassTorrentProvider(),
            new providers_1.MagnetDlTorrentProvider(),
        ];
    }
    TorrentAdapter.prototype.createProviders = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var providerStatuses, resolvedProviderStatuses;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerStatuses = this.allProviders.map(function (provider) { return provider.getStatus(); });
                        return [4 /*yield*/, Promise.all(providerStatuses)];
                    case 1:
                        resolvedProviderStatuses = _a.sent();
                        this.availableProviders = this.allProviders
                            .map(function (x, i) { return [x, resolvedProviderStatuses[i]]; })
                            .filter(function (provider) { return !!provider[1]; })
                            .map(function (a) { return a.shift(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    TorrentAdapter.prototype.selectTorrents = function (torrents) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, provider_utils_1.ProviderUtils.sortTorrentsBySeeders(torrents.filter(function (torrent) { return !!torrent.quality; } // && torrent.quality !== 'n/a'
                    ))];
            });
        });
    };
    TorrentAdapter.prototype.appendAttributes = function (providerResults, method) {
        return utils_1.Utils.merge(providerResults).map(function (result) { return (tslib_1.__assign({}, result, { method: method, cached: Date.now(), health: provider_utils_1.ProviderUtils.getHealth(result.seeders || 0, result.leechers || 0), quality: !!result.quality
                ? result.quality
                : provider_utils_1.ProviderUtils.determineQuality(result.metadata, result.magnet) })); });
    };
    TorrentAdapter.prototype.filterShows = function (show, _a) {
        var season = _a.season, episode = _a.episode;
        return (show.metadata.toLowerCase().includes(provider_utils_1.ProviderUtils.formatSeasonEpisodeToString(season, episode)) && show.seeders !== 0);
    };
    TorrentAdapter.prototype.search = function (query, type, extendedDetails) {
        if (extendedDetails === void 0) { extendedDetails = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var torrentPromises, providerResults;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.availableProviders)
                            throw new Error('You must call TorrentAdapter.createProviders() first');
                        torrentPromises = this.availableProviders.map(function (provider) { return provider.provide(query, type, extendedDetails); });
                        return [4 /*yield*/, Promise.all(torrentPromises)];
                    case 1:
                        providerResults = _a.sent();
                        switch (type) {
                            case constants_1.MOVIES:
                                return [2 /*return*/, this.selectTorrents(this.appendAttributes(providerResults, type))];
                            case constants_1.SHOWS:
                                return [2 /*return*/, this.selectTorrents(this.appendAttributes(providerResults, type)
                                        .filter(function (show) { return !!show.metadata; })
                                        .filter(function (show) { return _this.filterShows(show, extendedDetails); }))];
                            default:
                                return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return TorrentAdapter;
}());
exports.TorrentAdapter = TorrentAdapter;
//# sourceMappingURL=torrent.adapter.js.map