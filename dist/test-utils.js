"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tmdb = require("../config/tmdb.config.json");
var TestUtils;
(function (TestUtils) {
    function validateMovieTorrents(torrents) {
        return expect(torrents).toContainEqual(expect.objectContaining({
            //id: expect.any(Number),
            size: expect.any(String),
            magnet: expect.any(String),
            provider: expect.any(String),
            seeders: expect.any(Number),
            quality: expect.any(String),
            method: expect.any(String),
            health: expect.any(String),
            metadata: expect.any(String),
        }));
    }
    TestUtils.validateMovieTorrents = validateMovieTorrents;
    function validateMovieMetadata(metadata) {
        return expect(metadata).toMatchObject({
            id: expect.any(Number),
            ietf: expect.any(String),
            title: expect.any(String),
            originalTitle: expect.any(String),
            poster: expect.stringContaining(tmdb.poster),
            backdrop: expect.stringContaining(tmdb.backdrop),
            genres: expect.arrayContaining([expect.any(String)]),
            type: expect.stringMatching('movie'),
            summary: expect.any(String),
            popularity: expect.any(Number),
            tmdb: expect.any(Number),
            imdb: expect.any(String),
            year: expect.any(String),
            released: expect.any(String),
            voted: expect.any(Number),
            votes: expect.any(Number),
            runtime: expect.any(String),
            cached: expect.any(Number),
            torrents: expect.anything(),
        });
    }
    TestUtils.validateMovieMetadata = validateMovieMetadata;
})(TestUtils = exports.TestUtils || (exports.TestUtils = {}));
//# sourceMappingURL=test-utils.js.map