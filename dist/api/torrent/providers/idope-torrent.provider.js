"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cheerio = require("cheerio");
var axios_1 = require("axios");
var provider_utils_1 = require("../provider-utils");
var utils_1 = require("../../../utils");
var constants_1 = require("../../../constants");
var iDopeTorrentProvider = /** @class */ (function () {
    function iDopeTorrentProvider() {
        var _this = this;
        this.endpoint = 'https://idope.se';
        this.provider = 'iDope';
        this.api = axios_1.default.create({
            baseURL: this.endpoint,
            timeout: 2000,
        });
        this.getStatus = function () { return utils_1.Utils.promise.didResolve(function () { return _this.api.get(''); }); };
    }
    iDopeTorrentProvider.prototype.fetchMovies = function (query) {
        var _this = this;
        return this.api.get("torrent-list/" + query + "/", {
            params: {
                c: 1,
            },
        }).then(function (res) { return _this.cheerio(res.data); })
            .catch(function () { return []; });
    };
    iDopeTorrentProvider.prototype.fetchShows = function (query) {
        var _this = this;
        return this.api.get("torrent-list/" + query + "/", {
            params: {
                c: 3,
            },
        }).then(function (res) { return _this.cheerio(res.data); })
            .catch(function () { return []; });
    };
    iDopeTorrentProvider.prototype.cheerio = function (html) {
        var $ = cheerio.load(html);
        var provider = this.provider;
        // Get the ten first results and create a list
        return $('.resultdiv').slice(0, 10).map(function () {
            // a elements are hidden
            return {
                metadata: String($(this).find('.resultdivtop .resultdivtopname').text()).trim(),
                size: $(this).find('.resultdivbotton .resultdivbottonlength').text(),
                seeders: Number($(this).find('.resultdivbotton .resultdivbottonseed').text()),
                //leechers: null,
                // sadly fetching the magnet this way doesnt work lol
                magnet: provider_utils_1.ProviderUtils.constructMagnet($(this).find('.resultdivbotton .hideinfohash').first().text()),
                provider: provider,
            };
        }).get();
    };
    iDopeTorrentProvider.prototype.provide = function (search, type, _a) {
        var season = _a.season, episode = _a.episode;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_b) {
                switch (type) {
                    case constants_1.MOVIES:
                        return [2 /*return*/, this.fetchMovies(search)];
                    case constants_1.SHOWS:
                        return [2 /*return*/, this.fetchShows(search + " " + provider_utils_1.ProviderUtils.formatSeasonEpisodeToString(season, episode))];
                    default:
                        return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    return iDopeTorrentProvider;
}());
exports.iDopeTorrentProvider = iDopeTorrentProvider;
//# sourceMappingURL=idope-torrent.provider.js.map