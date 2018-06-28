"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_react_router_1 = require("mobx-react-router");
var search_store_1 = require("./search.store");
exports.createStores = function (metadataAdapter) { return ({
    search: new search_store_1.SearchStore(metadataAdapter),
    router: new mobx_react_router_1.RouterStore(),
}); };
//# sourceMappingURL=index.js.map