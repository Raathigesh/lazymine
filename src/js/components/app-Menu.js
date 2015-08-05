/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppActions = require('../actions/app-actions');

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
            <ul className="nav nav-list search-menu pull-right" title="More options">
                <li className="dropdown">
                    <a className="menu-icon" data-toggle="dropdown" aria-expanded="false">
                        <span className="access-hide">Card Dropdown</span>
                        <span className="icon icon-menu"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li title="Refresh tasks">
                            <a href="javascript:void(0)" onClick={this._refreshTasks}>
                                <span className="icon icon-refresh margin-right-half"></span>Refresh
                            </a>
                        </li>
                        <li title="About Lazymine">
                            <a href="#about" data-toggle="modal">
                                <span className="icon icon-info-outline margin-right-half"></span>About
                            </a>
                        </li>
                        <li title="Disconnect from redmine">
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