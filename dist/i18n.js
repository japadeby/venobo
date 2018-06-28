"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var i18next = require("i18next");
var electron_is_dev_1 = require("electron-is-dev");
var react_i18next_1 = require("react-i18next");
exports.requireLocale = function (ietf) { return require("../../static/locales/" + ietf + ".json"); };
function createResources(ietfs) {
    return ietfs.reduce(function (locales, ietf) {
        var _a;
        return (tslib_1.__assign({}, locales, (_a = {}, _a[ietf] = exports.requireLocale(ietf), _a)));
    }, {});
}
exports.createResources = createResources;
function createI18n(ietf) {
    var resources = createResources([
        'da-DK',
        'en-US'
    ]);
    return i18next
        .use(react_i18next_1.reactI18nextModule)
        .init({
        resources: resources,
        lng: ietf,
        fallbackLng: 'en-US',
        debug: electron_is_dev_1.default,
        interpolation: {
            escapeValue: false,
        },
        react: {
            wait: true,
        },
    });
}
exports.createI18n = createI18n;
//# sourceMappingURL=i18n.js.map