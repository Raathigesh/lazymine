/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var WalkThrough = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            "Classes": "walkthrough"
        };
    },
    _mouseOver: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                "Classes": "walkthrough walkthrough-hover"
            });
        }
    },
    _mouseOut: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                "Classes": "walkthrough walkthrough-hoverout"
            });
        }
    },
    render : function () {
        "use strict";
        return (
            <div>
                <span onMouseOver={this._mouseOver} onMouseOut={this._mouseOut} className="icon icon-info walkthrough-icon"></span>
                <img className={this.state.Classes} src="assets/login_help.png" />
            </div>
        );
    }
});

module.exports = WalkThrough;