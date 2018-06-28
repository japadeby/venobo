"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_1 = require("mobx");
var SearchStore = /** @class */ (function () {
    function SearchStore(metadataAdapter) {
        var _this = this;
        this.metadataAdapter = metadataAdapter;
        this.active = false;
        this.toggle = function () { return _this.active = !_this.active; };
    }
    SearchStore.prototype.search = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.metadataAdapter.quickSearch(query)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        mobx_1.observable
    ], SearchStore.prototype, "active", void 0);
    tslib_1.__decorate([
        mobx_1.action
    ], SearchStore.prototype, "toggle", void 0);
    tslib_1.__decorate([
        mobx_1.action
    ], SearchStore.prototype, "search", null);
    return SearchStore;
}());
exports.SearchStore = SearchStore;
//# sourceMappingURL=search.store.js.map