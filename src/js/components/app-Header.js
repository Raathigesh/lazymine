/*global require, module, openExternalUrl, closeWindow, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    InfoBar = require('../components/app-InfoBar'),
    StateMixin = require('../mixins/app-StateMixin');


var Header = React.createClass({
    _minimize: function () {
        "use strict";
        minimizeWindow();
    },

    _close: function () {
        "use strict";
        closeWindow();
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
                <div className="row header-draggable-area">
                    <div className="col-xs-4">
                        <a href="javascript:void(0)" onClick={this._openExternalUrl}>
                            <img className="logo-img" src="assets/top-logo.png" title="Lazymine" />
                        </a>
                    </div>
                    <div className="col-xs-8">
                        <a className="close-btn pull-right" href="javascript:void(0)" onClick={this._close} title="Close">
                            <img src="assets/close.png" />
                        </a>
                        <a className="minimize-btn pull-right" href="javascript:void(0)" onClick={this._minimize} title="Minimize">
                            <img src="assets/minimize.png" />
                        </a>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = Header;