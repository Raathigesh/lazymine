/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var AppActions = require('../actions/app-actions');
var TextField = require('../components/form/app-TextField');
var RadioButton = require('../components/form/app-RadioButton');
var Title = require('../components/app-Title');
var Link = Router.Link;

var NavBar = React.createClass({

    render : function(){
        return (
            <nav id="navBar" className="menu">
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
                                        <Title text="Data Fetching Preference"/>
                                    </li>
                                    <li>
                                        <div className="form-group">
                                        <RadioButton
                                            value="*"
                                            label="All"
                                            defaultChecked={true} />
                                        <RadioButton
                                            value="me"
                                            label="Assigned To Me"/>
                                        </div>
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