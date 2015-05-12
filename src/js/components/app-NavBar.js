/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var AppActions = require('../actions/app-actions');
var TextField = require('../components/form/app-TextField');
var Link = Router.Link;

var NavBar = React.createClass({

    render : function(){
        return (
            <nav id="navBar" className="menu">
                <div className="menu-scroll">
                    <div className="menu-wrap">
                        <div className="menu-content">
                            <div className="menu-content-inner">
                                <ul class="nav">
                                    <li>
                                        <a href="#/setting">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#">About Us</a>
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