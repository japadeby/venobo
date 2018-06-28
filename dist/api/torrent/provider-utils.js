"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = require("axios");
var utils_1 = require("../../utils");
var ProviderUtils = /** @class */ (function () {
    function ProviderUtils() {
    }
    /**
     * Check if torrent file name includes hardcoded subs
     * @param {string} metadata
     * @returns {boolean}
     */
    ProviderUtils.hasHardcodedSubtitles = function (metadata) {
        return metadata.includes('hc') || metadata.includes('korsub');
    };
    /**
     * Check whether or not torrent was recorded with a camera
     * @param {string} metadata
     * @returns {boolean}
     */
    ProviderUtils.isCamRecorded = function (metadata) {
        return utils_1.Utils.includes(metadata, [
            'cam',
            'tc',
            'dvdscr',
            'ts',
            'blurred',
        ]);
    };
    /**
     * Check if metadata includes non english language
     * @param {string} metadata
     * @returns {boolean}
     */
    ProviderUtils.hasNonEnglishLanguage = function (metadata) {
        return utils_1.Utils.includes(metadata, [
            'french',
            'german',
            'greek',
            'dutch',
            'hindi',
            'português',
            'portugues',
            'spanish',
            'español',
            'espanol',
            'latino',
            'russian',
            'subtitulado',
        ]);
    };
    /**
     * Check if torrent has subtitles
     * @param {string} metadata
     * @returns {boolean}
     */
    ProviderUtils.hasSubtitles = function (metadata) {
        return metadata.includes('sub');
    };
    /*private static hasNonNativeCodec(metadata: string)  {
        return (
            metadata.includes('avi') ||
            metadata.includes('mkv')
        );
    }*/
    /**
     * Determine video quality of torrent
     * @param {string} metadata
     * @param {string} magnet
     * @returns {null}
     */
    ProviderUtils.determineQuality = function (metadata, magnet) {
        var fileName = (metadata || magnet).toLowerCase();
        // Filter videos recorded with a camera
        if (this.isCamRecorded(fileName))
            return null;
        // Filter non-english languages
        if (this.hasNonEnglishLanguage(fileName))
            return null;
        // Filter videos with hardcoded subtitles
        if (this.hasHardcodedSubtitles(fileName))
            return null;
        // Filter videos with 'rendered' subtitles
        if (this.hasSubtitles(fileName))
            return null;
        // Guess the quality 4k
        if (utils_1.Utils.includes(fileName, [
            '4k',
            'uhd',
            'qhd',
        ]))
            return '4k';
        // Guess the quality 720p
        if (utils_1.Utils.includes(fileName, [
            '720',
            'rip',
            'mp4',
            'web',
            'hdtv',
            'eng',
        ]))
            return '720p';
        // Guess the quality 1080p
        if (utils_1.Utils.includes(fileName, [
            '1080',
            'bluray',
            'blu-ray',
            'mkv',
        ]))
            return '1080p';
        // Guess the quality 480p
        if (utils_1.Utils.includes(fileName, [
            '480',
            'xvid',
            'dvd',
        ]))
            return '480p';
        return null;
    };
    ProviderUtils.sortTorrentsBySeeders = function (torrents) {
        return torrents.sort(function (prev, next) {
            if (prev.seeders === next.seeders)
                return 0;
            return prev.seeders > next.seeders
                ? -1
                : 1;
        });
    };
    ProviderUtils.formatSeasonEpisodeToString = function (season, episode) {
        return (('s' + (String(season).length === 1 ? '0' + season : season)) +
            ('e' + (String(episode).length === 1 ? '0' + episode : episode)));
    };
    ProviderUtils.getHealth = function (seeders, leechers) {
        if (leechers === void 0) { leechers = 0; }
        var ratio = (seeders && !!leechers)
            ? (seeders / leechers)
            : seeders;
        if (seeders < 50)
            return 'poor';
        if (ratio > 1 && seeders >= 50 && seeders < 100)
            return 'decent';
        if (ratio > 1 && seeders >= 100)
            return 'healthy';
        return 'poor';
    };
    ProviderUtils.mergeProviderPromises = function (promises) {
        return Promise.all(promises)
            .then(function (res) {
            return utils_1.Utils.merge(res).filter(function (arr) { return arr.length !== 0; });
        }).catch(function () { return []; });
    };
    ProviderUtils.createApi = function (baseURL) {
        return axios_1.default.create({
            timeout: 5000,
            baseURL: baseURL,
        });
    };
    ProviderUtils.createReliableEndpointApi = function (endpoints) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var requests, endpoint;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requests = endpoints.map(function (endpoint) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.get(endpoint, {
                                            timeout: 1000
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, endpoint];
                                }
                            });
                        }); });
                        return [4 /*yield*/, utils_1.Utils.promise.raceResolve(requests)];
                    case 1:
                        endpoint = _a.sent();
                        return [2 /*return*/, this.createApi(endpoint)];
                }
            });
        });
    };
    /**
     * Construct magnet link from torrent hash
     * @param {string} hash
     * @returns {string}
     */
    ProviderUtils.constructMagnet = function (hash) { return "magnet:?xt=urn:btih:" + hash; };
    return ProviderUtils;
}());
exports.ProviderUtils = ProviderUtils;
//# sourceMappingURL=provider-utils.js.map