"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var View = /** @class */ (function (_super) {
    tslib_1.__extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(Header, null),
            this.props.children,
            React.createElement(Search, null),
            React.createElement(Tooltip, null)));
    };
    return View;
}(React.Component));
exports.View = View;
//# sourceMappingURL=View.js.map