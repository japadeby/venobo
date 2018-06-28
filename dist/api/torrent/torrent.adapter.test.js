"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var torrent_adapter_1 = require("./torrent.adapter");
var test_utils_1 = require("../../test-utils");
var constants_1 = require("../../constants");
describe('TorrentAdapter', function () {
    var torrentAdapter = new torrent_adapter_1.TorrentAdapter();
    beforeAll(function () { return torrentAdapter.createProviders(); });
    it('should check providers', function () {
        return expect(torrentAdapter.createProviders()).resolves.toBeUndefined();
    });
    it('should fetch torrents by search query', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var torrents;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, torrentAdapter.search('Escape Plan', constants_1.MOVIES)];
                case 1:
                    torrents = _a.sent();
                    return [2 /*return*/, test_utils_1.TestUtils.validateMovieTorrents(torrents)];
            }
        });
    }); });
    it('should fetch torrents by imdb id', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var torrents;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, torrentAdapter.search('Rampage (2018)', constants_1.MOVIES, {
                        imdbId: 'tt2231461'
                    })];
                case 1:
                    torrents = _a.sent();
                    return [2 /*return*/, test_utils_1.TestUtils.validateMovieTorrents(torrents)];
            }
        });
    }); });
});
//# sourceMappingURL=torrent.adapter.test.js.map