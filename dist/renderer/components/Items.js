"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classNames = require("classnames");
exports.SectionMenu = function (_a) {
    var children = _a.children;
    return (React.createElement("section", { className: "block section-menu active" }, children));
};
exports.SectionWrapper = function (_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "section-wrapper" }, children));
};
exports.Content = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("div", { id: "content", className: className }, children));
};
exports.ContentStarred = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement(exports.Content, { className: classNames('starred', className) }, children));
};
exports.ContentSection = function (_a) {
    var children = _a.children;
    return (React.createElement(exports.Content, { className: "section" }, children));
};
exports.ContentProduct = function (_a) {
    var children = _a.children;
    return (React.createElement(exports.Content, { className: "product" }, children));
};
exports.MovieProduct = function (_a) {
    var children = _a.children;
    return (React.createElement("section", { className: "block product movie" }, children));
};
exports.PlayerWrapper = function (_a) {
    var onClick = _a.onClick;
    return (React.createElement("div", { className: "block-product" },
        React.createElement(exports.Scaffold, null,
            React.createElement("div", { className: "player-wrapper" },
                React.createElement("div", { className: "react-play-button large", onClick: onClick },
                    React.createElement("figure", { className: "icon-content" }))))));
};
exports.Hero = function (_a) {
    var children = _a.children, className = _a.className;
    return (React.createElement("section", { className: classNames('hero', className) }, children));
};
exports.HeroWrapper = function (_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "hero-wrapper" }, children));
};
exports.Scaffold = function (_a) {
    var children = _a.children, className = _a.className;
    return (React.createElement("div", { className: classNames('scaffold', className) }, children));
};
exports.CollectionHeader = function (_a) {
    var children = _a.children;
    return (React.createElement("header", { className: "collection-header" }, children));
};
exports.BlockCollection = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("section", { className: classNames('block collection', className) }, children));
};
exports.HeaderButton = function (_a) {
    var onClick = _a.onClick, children = _a.children;
    return (React.createElement("span", { onClick: onClick, className: "see-all button" }, children));
};
exports.ReactGrid = function (_a) {
    var className = _a.className, children = _a.children;
    return (React.createElement("div", { className: classNames('react-grid', className) },
        React.createElement("span", null, children)));
};
exports.Loader = function (_a) {
    var top = _a.top, container = _a.container, spinner = _a.spinner, bottom = _a.bottom;
    var searchSpinner = classNames('search-spinner load-spinner no-query', spinner);
    var spinnerContainer = classNames('spinner-container', container);
    var style = !top && !bottom
        ? { marginTop: (window.innerHeight / 2) - 66 + "px", marginBottom: bottom }
        : { marginTop: top, marginBottom: bottom };
    return (React.createElement("div", { className: searchSpinner, style: style },
        React.createElement("div", { className: spinnerContainer },
            React.createElement("div", { className: "spinner-line line01" }),
            React.createElement("div", { className: "spinner-line line02" }),
            React.createElement("div", { className: "spinner-line line03" }),
            React.createElement("div", { className: "spinner-line line04" }),
            React.createElement("div", { className: "spinner-line line05" }),
            React.createElement("div", { className: "spinner-line line06" }),
            React.createElement("div", { className: "spinner-line line07" }),
            React.createElement("div", { className: "spinner-line line08" }),
            React.createElement("div", { className: "spinner-line line09" }),
            React.createElement("div", { className: "spinner-line line10" }),
            React.createElement("div", { className: "spinner-line line11" }),
            React.createElement("div", { className: "spinner-line line12" }))));
};
//# sourceMappingURL=Items.js.map