/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

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
                <div>
                    <img src="assets/Cat.GIF"/>
                    <h4>Fetching Your Data</h4>
                </div>
            </div>
        );
    }
});

module.exports = Loader; 