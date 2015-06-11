/*global require, module, openExternalUrl, closeWindow, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
    SearchBox = require('../components/app-SearchBox'),
    AppStore = require('../stores/app-base-store'),
    InfoBar = require('../components/app-InfoBar'),
    StateMixin = require('../mixins/app-StateMixin');


var Header = React.createClass({
    mixins: [StateMixin],

    _minimize: function () {
        "use strict";
        minimizeWindow();
    },

    _close: function () {
        "use strict";
        closeWindow();
    },

    getSelectedDate: function () {
        "use strict";
        return this.refs.infoBar.getSelectedDate();
    },
    _openExternalUrl: function (event) {
        "use strict";
        event.nativeEvent.stopImmediatePropagation();
        openExternalUrl("http://lazymine.github.io/");
        minimizeWindow();
    },
    render : function () {
        "use strict";
        return (
            <header className="header navbar navbar-default">
                <div className="row">
                    <div className="col-xs-4 header-draggable-area">
                        <a href="javascript:void(0)" onClick={this._openExternalUrl}>
                            <img className="logo-img" src="assets/top-logo.png" title="Lazymine" />
                        </a>
                    </div>
                    <div className="col-xs-4 header-draggable-area">
                        { this.props.search == "show" ? <InfoBar ref="infoBar"/> : null }
                    </div>
                    <div className="col-xs-4 header-draggable-area">
                        <a className="close-btn pull-right" href="javascript:void(0)" onClick={this._close} title="Close">
                            <img src="assets/close.png" />
                        </a>
                        <a className="minimize-btn pull-right" href="javascript:void(0)" onClick={this._minimize} title="Minimize">
                            <img src="assets/minimize.png" />
                        </a>
                    </div>
                </div>
                { this.props.search == "show" ? <SearchBox items={this.state.filteredResult}/> : null }
            </header>
        );
    }
});

module.exports = Header;