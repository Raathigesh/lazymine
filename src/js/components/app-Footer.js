/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var Footer = React.createClass({
    render: function () {
        "use strict";
        return (
            <div className="btn-group btn-group-justified bottom-button-group" style={{position:'fixed', bottom:'3'}}>
                <a className="btn btn-flat btn-cancel waves-button waves-effect waves-light"
                   onClick={this.props.secondaryClick}>
                    {this.props.secondaryText}
                </a>
                <a className="btn btn-flat btn-success waves-button waves-effect waves-light"
                   onClick={this.props.primaryClick}>
                    {this.props.primaryText}
                </a>
            </div>
        );
    }
});

module.exports = Footer;