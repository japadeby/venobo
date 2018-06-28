"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var UnknownDatabaseException = /** @class */ (function (_super) {
    tslib_1.__extends(UnknownDatabaseException, _super);
    function UnknownDatabaseException(database) {
        var _this = _super.call(this, "Database " + database + " doesn't exist.") || this;
        _this.name = 'UnknownDatabaseException';
        return _this;
    }
    ;
    return UnknownDatabaseException;
}(Error));
exports.UnknownDatabaseException = UnknownDatabaseException;
//# sourceMappingURL=unknown-database.exception.js.map