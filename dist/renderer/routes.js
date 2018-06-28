"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = require("./components");
var containers_1 = require("./containers");
exports.routes = [{
        component: components_1.View,
        routes: [
            {
                path: '/',
                exact: true,
                component: containers_1.Home
            }
        ],
    }];
//# sourceMappingURL=routes.js.map