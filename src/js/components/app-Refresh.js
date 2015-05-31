/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Router = require('react-router'),
    AppActions = require('../actions/app-actions'),
    Link = Router.Link;

var Refresh = React.createClass({
    _refreshTasks: function () {
        "use strict";
        AppActions.refreshIssues();
    },
    render : function () {
        "use strict";
        return (<div className="fbtn-container top-refresh">
                    <div className="fbtn-inner" onClick={this._refreshTasks}>
                        <a className="fbtn fbtn-green fbtn-lg">
                            <span className="fbtn-text">Refresh Items</span>
                            <span className="fbtn-ori icon icon-refresh"></span>
                        </a>
                    </div>
                </div>);
    }
});

module.exports = Refresh;