/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var Loader = React.createClass({
    render : function () {
        "use strict";
        var className = "overlay hide";

        if (this.props.isLoading) {
            className = "overlay";
        } else {
            className = "overlay hide";
        }

        return (
            <div className={className}>
                <div className="overlay_black"></div>
                <img src="assets/Cat.GIF"/>
                <h4>Fetching Your Data</h4>
            </div>
        );
    }
});

module.exports = Loader; 