"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cheerio = require("cheerio");
var provider_utils_1 = require("../provider-utils");
var utils_1 = require("../../../utils");
var constants_1 = require("../../../constants");
var ThePirateBayTorrentProvider = /** @class */ (function () {
    function ThePirateBayTorrentProvider() {
        this.endpoints = ['https://thepiratebay.org', 'https://tpbship.org'];
        this.provider = 'ThePirateBay';
    }
    ThePirateBayTorrentProvider.prototype.fetch = function (query) {
        var _this = this;
        return this.api.get("search/" + query + "/0/99/200")
            .then(function (res) { return _this.cheerio(res.data); })
            .catch(function () { return []; });
    };
    ThePirateBayTorrentProvider.prototype.cheerio = function (html) {
        var $ = cheerio.load(html);
        var provider = this.provider;
        return $('#main-content #searchResult tbody tr').slice(0, 10).map(function () {
            var $td = $(this).find('td');
            return {
                metadata: $td.eq(1).find('.detName .detLink').text(),
                magnet: $td.eq(1).find('[title="Download this torrent using magnet"]').attr('href'),
                size: $td.eq(1).find('.detDesc').text().split(',')[1].substring(6),
                seeders: parseInt($td.eq(2).text(), 10),
                leechers: parseInt($td.eq(3).text(), 10),
                verified: !!$td.eq(1).find('img[src="https://tpbship.org/static/img/vip.gif"]').length,
                provider: provider,
            };
        }).get();
    };
    ThePirateBayTorrentProvider.prototype.getStatus = function () {
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
    ThePirateBayTorrentProvider.prototype.provide = function (search, type, _a) {
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
    return ThePirateBayTorrentProvider;
}());
exports.ThePirateBayTorrentProvider = ThePirateBayTorrentProvider;
//# sourceMappingURL=tpb-torrent.provider.js.map