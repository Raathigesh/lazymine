/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Router = require('react-router'),
    AppActions = require('../actions/app-actions'),
    TextField = require('../components/form/app-TextField'),
    RadioButton = require('../components/form/app-RadioButton'),
    Title = require('../components/app-Title'),
    Link = Router.Link;

var NavBar = React.createClass({
    render : function () {
        "use strict";
        return (
            <nav id="navBar" className="menu full-height-menu">
                <div className="menu-scroll">
                    <div className="menu-wrap">
                        <div className="menu-content">
                            <div className="menu-content-inner">
                                <ul className="nav">
                                    <li>
                                        <a href="#/setting">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#">About Us</a>
                                    </li>
                                </ul>
                            </div>
                                <hr> </hr>
                            <div className="menu-content-inner">
                                <ul className="nav">
                                    <li>
                                        <a>All</a>
                                    </li>
                                    <li>
                                        <a>Assigned To Me</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
});

module.exports = NavBar;