"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_dom_1 = require("react-router-dom");
var electron_1 = require("electron");
var mobx_react_1 = require("mobx-react");
var classNames = require("classnames");
var Header = /** @class */ (function (_super) {
    tslib_1.__extends(Header, _super);
    function Header() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hoverActive: false,
        };
        _this.hoverDetails = function () {
            _this.setState({
                hoverActive: !_this.state.hoverActive
            });
        };
        _this.quitApp = function () { return electron_1.ipcRenderer.emit('appQuit'); };
        return _this;
    }
    Header.prototype.render = function () {
        var _a = this.props, user = _a.config.user, search = _a.search, t = _a.t;
        var pageHeaderClass = classNames('block page-header', { 'active-search': search.active });
        var searchClass = classNames('search', { 'active': search.active });
        return (React.createElement("div", { className: pageHeaderClass },
            React.createElement("div", { className: "scaffold" },
                React.createElement("div", { className: "logo" },
                    React.createElement(react_router_dom_1.NavLink, { to: "/home" },
                        React.createElement("img", { src: '/some/url', width: "144", height: "35" }))),
                React.createElement("nav", { className: "sections" },
                    React.createElement(react_router_dom_1.NavLink, { to: "/discover/shows/all/popularity.desc" },
                        React.createElement("span", null, t('nav.series'))),
                    React.createElement(react_router_dom_1.NavLink, { to: "/discover/movies/all/popularity.desc" },
                        React.createElement("span", null, t('nav.movies')))),
                React.createElement("div", { className: "user", ref: "user" },
                    React.createElement("div", { className: "details authenticated", onMouseEnter: this.hoverDetails, onMouseLeave: this.hoverDetails },
                        React.createElement("div", { className: "summary" },
                            React.createElement("button", { className: "user-name" },
                                React.createElement("div", null, user.id))),
                        React.createElement("div", { className: "dropdown" },
                            React.createElement("div", { className: "box-shadow" },
                                React.createElement("ul", null,
                                    React.createElement("li", null,
                                        React.createElement(react_router_dom_1.NavLink, { to: "/watched", className: "icon watched" },
                                            React.createElement("span", null, t('watched')))),
                                    React.createElement("li", null,
                                        React.createElement(react_router_dom_1.NavLink, { to: "/starred", className: "icon starred" },
                                            React.createElement("span", null, t('starred')))),
                                    React.createElement("li", null,
                                        React.createElement(react_router_dom_1.NavLink, { to: "/preferences", className: "icon settings" },
                                            React.createElement("span", null, t('preferences'))))),
                                React.createElement("ul", { className: "footer" },
                                    React.createElement("li", null,
                                        React.createElement("a", { className: "logout", onClick: this.quitApp }, "Quit"))))))),
                React.createElement("div", { className: searchClass, onClick: search.toggle },
                    React.createElement("div", { className: "search-icon" })),
                React.createElement("div", { className: "search-backdrop" }))));
    };
    Header = tslib_1.__decorate([
        react_i18next_1.translate(),
        mobx_react_1.inject(['search', 'config']),
        mobx_react_1.observer
    ], Header);
    return Header;
}(React.Component));
exports.Header = Header;
//# sourceMappingURL=Header.js.map