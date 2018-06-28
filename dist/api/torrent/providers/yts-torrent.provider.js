"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var provider_utils_1 = require("../provider-utils");
var constants_1 = require("../../../constants");
var utils_1 = require("../../../utils");
var YtsTorrentProvider = /** @class */ (function () {
    function YtsTorrentProvider() {
        var _this = this;
        this.domains = ['yts.am', 'yts.unblocked.vet'];
        this.provider = 'Yts';
        this.createEndpoint = function (domain) { return "https://" + domain + "/api/v2/list_movies.json"; };
        this.formatTorrent = function (torrent) { return ({
            metadata: String((torrent.url + torrent.hash) || torrent.hash),
            magnet: provider_utils_1.ProviderUtils.constructMagnet(torrent.hash),
            size: torrent.size,
            quality: torrent.quality,
            seeders: parseInt(torrent.seeds, 10),
            leechers: parseInt(torrent.peers, 10),
            verified: true,
            provider: _this.provider,
        }); };
    }
    YtsTorrentProvider.prototype.fetch = function (query) {
        return this.api.get('', {
            params: {
                query_term: query,
                order_by: 'desc',
                sort_by: 'seeds',
                limit: 50,
            }
        });
    };
    YtsTorrentProvider.prototype.getStatus = function () {
        var _this = this;
        return utils_1.Utils.promise.didResolve(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, provider_utils_1.ProviderUtils.createReliableEndpointApi(this.domains.map(function (domain) { return _this.createEndpoint(domain); }))];
                    case 1:
                        _a.api = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    YtsTorrentProvider.prototype.provide = function (search, type, _a) {
        var imdbId = _a.imdbId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (type) {
                    case constants_1.MOVIES:
                        return [2 /*return*/, this.fetch(imdbId || search)
                                .then(function (_a) {
                                var data = _a.data.data;
                                if (data.movie_count === 0)
                                    return [];
                                return utils_1.Utils.merge(data.movies.map(function (_a) {
                                    var torrents = _a.torrents;
                                    return torrents.map(function (torrent) { return _this.formatTorrent(torrent); });
                                }));
                            })];
                    default:
                        return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    return YtsTorrentProvider;
}());
exports.YtsTorrentProvider = YtsTorrentProvider;
//# sourceMappingURL=yts-torrent.provider.js.map