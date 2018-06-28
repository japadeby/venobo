"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PouchDB = require("pouchdb");
var findCursor = require("pouchdb-find");
// import erase from 'pouchdb-erase';
var exceptions_1 = require("../exceptions");
// PouchDB.debug.enable('*');
PouchDB.plugin(findCursor);
// PouchDB.plugin(erase);
var Database;
(function (Database) {
    function createIndexDatabase(name, fields) {
        var database = new PouchDB(name, { adapter: 'leveldb' });
        database.createIndex({
            index: { fields: fields },
        });
        return database;
    }
    Database.createIndexDatabase = createIndexDatabase;
    Database.metadata = createIndexDatabase('metadata', ['id', 'ietf']);
    Database.movies = createIndexDatabase('movies', ['id', 'provider']);
    Database.users = createIndexDatabase('users', ['id']);
    Database.findOne = function (database, opts) { return Database.find(database, opts)[0]; };
    function find(database, opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Database[database])
                            throw new exceptions_1.UnknownDatabaseException(database);
                        return [4 /*yield*/, Database[database]];
                    case 1:
                        res = (_a.sent()).find(opts).docs;
                        if (res.length === 0)
                            throw new Error('Empty result');
                        return [2 /*return*/, res];
                }
            });
        });
    }
    Database.find = find;
    function destroy() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Database.metadata.destroy()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Database.movies.destroy()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    Database.destroy = destroy;
    /*export async function truncate() {
      await metadata.erase();
      await movies.erase();
    }*/
})(Database = exports.Database || (exports.Database = {}));
//# sourceMappingURL=database.js.map