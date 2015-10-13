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
            if (this.isMounted()) {
                this.setState({
                    display: true
                });
            }
        }
    },
    _closeToast: function () {
        "use strict";
        if (this.isMounted()) {
            this.setState({
                display: false
            });
        }
    },
    render: function () {
        "use strict";
        var output = null,
            identifier = easyGid.new();

        if (this.state.display && this.props.display) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(this._closeToast, 3000);
            output = <div className="lazy-toast lazy-toast-show">
                <div className="tooltip bottom in lazy-tooltip" id={identifier}>
					<div className="lazy-toast-inner tooltip-inner">
                        <a href="javascript:void(0)" className="pull-right" onClick={this._closeToast}> Dismiss</a>
						{
							(this.props.type == 'applyDismiss')? <a href="javascript:void(0)" className="pull-right" onClick={this.state.applyClick}> {this.props.applyBtnTitle}</a> : null
						}
                        <div className="lazy-toast-text">{ this.props.message }</div>
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
