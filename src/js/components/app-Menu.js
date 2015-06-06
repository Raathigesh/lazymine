/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Router = require('react-router'),
    AppActions = require('../actions/app-actions'),
    Link = Router.Link;

var Menu = React.createClass({
    _refreshTasks: function () {
        "use strict";
        AppActions.refreshIssues();
    },
    _logout: function () {
        "use strict";
        AppActions.logout();
    },
    render: function () {
        "use strict";
        return (
            <ul className="nav nav-list pull-right search-menu">
                <li className="dropdown">
                    <a className="" data-toggle="dropdown" aria-expanded="false">
                        <span className="access-hide">Card Dropdown</span>
                        <span className="icon icon-more-vert"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="javascript:void(0)" onClick={this._refreshTasks}>
                                <span className="icon icon-refresh margin-right-half"></span>Refresh
                            </a>
                        </li>
                        <li>
                            <a href="#about" data-toggle="modal">
                                <span className="icon icon-info-outline margin-right-half"></span>About
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" onClick={this._logout}>
                                <span className="icon icon-exit-to-app margin-right-half"></span>Disconnect
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        );
    }
});

module.exports = Menu;