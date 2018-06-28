"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../../utils");
var provider_utils_1 = require("../provider-utils");
var constants_1 = require("../../../constants");
var MagnetDlTorrentProvider = /** @class */ (function () {
    function MagnetDlTorrentProvider() {
        this.endpoints = ['http://www.magnetdl.com', 'https://magnetdl.unblocked.vet'];
        this.provider = 'MagnetDl';
    }
    MagnetDlTorrentProvider.prototype.fetch = function (query) {
        var _this = this;
        return this.api.get(query.substring(0, 1) + "/" + query)
            .then(function (res) { return _this.cheerio(res.data); })
            .catch(function () { return []; });
    };
    MagnetDlTorrentProvider.prototype.cheerio = function (html) {
        var $ = cheerio.load(html);
        var provider = this.provider;
        return $('.download tbody tr:nth-child(2n+1)').slice(0, 10).map(function () {
            var $td = $(this).find('td');
            return {
                metadata: $td.eq(1).find('a').text(),
                magnet: $td.eq(0).find('a').attr('href'),
                size: $td.eq(5).text(),
                seeders: parseInt($td.eq(6).text(), 10),
                leechers: parseInt($td.eq(7).text(), 10),
                provider: provider,
            };
        }).get();
    };
    MagnetDlTorrentProvider.prototype.getStatus = function () {
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
    MagnetDlTorrentProvider.prototype.provide = function (search, type, _a) {
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
    return MagnetDlTorrentProvider;
}());
exports.MagnetDlTorrentProvider = MagnetDlTorrentProvider;
//# sourceMappingURL=magnetdl.provider.js.map