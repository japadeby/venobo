"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cheerio = require("cheerio");
var provider_utils_1 = require("../provider-utils");
var constants_1 = require("../../../constants");
var utils_1 = require("../../../utils");
var KickassTorrentProvider = /** @class */ (function () {
    function KickassTorrentProvider() {
        this.endpoints = ['https://kickassto.org', 'https://kat.unblocked.vet/'];
        this.provider = 'Kickass';
    }
    KickassTorrentProvider.prototype.fetch = function (query) {
        var _this = this;
        return this.api.get("usearch/" + query + "/", {
            params: {
                field: 'seeders',
                sorder: 'desc',
            }
        }).then(function (res) { return _this.cheerio(res.data); })
            .catch(function () { return []; });
    };
    KickassTorrentProvider.prototype.cheerio = function (html) {
        var $ = cheerio.load(html);
        var provider = this.provider;
        return $("table.data tr:not('.firstr')").slice(0, 10).map(function () {
            return {
                metadata: $(this).find('a.cellMainLink').text(),
                magnet: $(this).find('[title="Torrent magnet link"]').attr('href'),
                size: $(this).find('.nobr.center').text(),
                seeders: parseInt($(this).find('.green.center').text(), 10),
                leechers: parseInt($(this).find('.red.lasttd.center').text(), 10),
                verified: !!$(this).find('[title="Verified Torrent"]').length,
                provider: provider
            };
        }).get();
    };
    KickassTorrentProvider.prototype.getStatus = function () {
        var _this = this;
        return utils_1.Utils.promise.didResolve(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, provider_utils_1.ProviderUtils.createReliableEndpointApi(this.endpoints)];
                    case 1:
                        _a.api = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    KickassTorrentProvider.prototype.provide = function (search, type, _a) {
        var season = _a.season, episode = _a.episode;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                switch (type) {
                    case constants_1.MOVIES:
                        return [2 /*return*/, this.fetch(search)];
                    case constants_1.SHOWS:
                        return [2 /*return*/, this.fetch(search + " " + provider_utils_1.ProviderUtils.formatSeasonEpisodeToString(season, episode))];
                    default:
                        return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    return KickassTorrentProvider;
}());
exports.KickassTorrentProvider = KickassTorrentProvider;
//# sourceMappingURL=kickass-torrent.provider.js.map