/*global require, module, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
    Router = require('react-router'),
    SearchBox = require('../components/app-SearchBox'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    InfoBar = require('../components/app-InfoBar'),
    Link = Router.Link;

var Header = React.createClass({
    getInitialState: function () {
        "use strict";
        return AppStore.getState();
    },

    componentWillMount: function () {
        "use strict";
        AppStore.addChangeListener(this._change);
    },

    _change: function () {
        "use strict";
        var storeState = AppStore.getState();
        this.setState(storeState);
    },

    _close: function () {
        "use strict";
        minimizeWindow();
    },

    getSelectedDate: function () {
        "use strict";
        return this.refs.infoBar.getSelectedDate();
    },

    render : function () {
        "use strict";
        return (
            <header className="header navbar navbar-default">
                <div className="header-row">
                    <div className="header-brand">
                        <a className="navbar-brand" href="#">
                            <img className="logo-img" src="assets/top-logo.png" />
                        </a>
                    </div>
                    { this.props.search == "show" ? <InfoBar ref="infoBar"/> : null }
                    <a className="close-btn pull-right" href="#" onClick={this._close}>
                        <span className="access-hide">Close</span>
                        <span className="icon icon-close icon-lg"></span>
                    </a>
                </div>
                { this.props.search == "show" ? <SearchBox items={this.state.filteredResult}/> : null }
            </header>
        );
    }
});

module.exports = Header;