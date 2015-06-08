/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    easyGid = require("easy-guid");

var Toast = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            display: false
        };
    },
    componentWillReceiveProps: function (nextProps) {
        "use strict";
        if (nextProps.error !== null) {
            this.setState({
                display: true
            });
        }
    },
    _closeToast: function () {
        "use strict";
        this.setState({
            display: false
        });
    },
    render: function () {
        "use strict";
        var output = null,
            identifier = easyGid.new();

        if (this.state.display) {
            output = <div className="toast toast-show">
                <div className="tooltip bottom in lazy-tooltip" id={identifier}>
                    <div className="toast-inner tooltip-inner">
                        <a href="javascript:void(0)" className="pull-right" onClick={this._closeToast}>Dismiss</a>
                        <div className="toast-text">{ this.props.error.message }</div>
                    </div>
                </div>
            </div>
        }

        return (
            output
        );
    }
});

module.exports = Toast;