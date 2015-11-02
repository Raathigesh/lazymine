/*global require, module, openExternalUrl, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react');

var About = React.createClass({
    _openExternalUrl: function (event) {
        "use strict";
        openExternalUrl("http://lazymine.github.io/");
        minimizeWindow();
        event.nativeEvent.stopImmediatePropagation();
    },
    render: function () {
        "use strict";
        return (
            <div aria-hidden="true" className="modal fade" id="about" role="dialog" tabIndex="-1">
                <div className="modal-dialog-about">
                    <div className="modal-content">
                        <div className="modal-inner">
                            <div className="row clearfix text-center">
                                <div className="col-md-12 column">
                                    <div className="row clearfix">
                                        <div className="col-md-12 column">
                                            <img alt="Login" className="cloudy" src="assets/icon_about.png"></img>
                                        </div>
                                    </div>
                                    <div className="row clearfix">
                                        <div className="col-md-12 column text-center">
                                            <h2>Lazymine</h2>
                                            <p className="version">v 2.0.0 - Ragamuffin</p>
                                        </div>
                                    </div>
                                    <div className="row clearfix">
                                        <div className="col-md-12 column text-center">
                                            <p>
                                                A god sent redmine client which will make you smile everytime you enter time.
                                                <br/><a onClick={this._openExternalUrl}>lazymine.github.io</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = About;
