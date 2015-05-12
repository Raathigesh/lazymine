/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var AppActions = require('../actions/app-actions');
var Link = Router.Link;

var NavBar = React.createClass({

    render : function(){
        var navClass = "menu menu-left menu-search";

        if(this.props.state === "open") {
            navClass = "menu menu-left menu-search open";
        }
        else {
            navClass = "menu menu-left menu-search";
        }

        return (
            <div className={navClass}>
                <div className="menu-scroll">
                    <div className="menu-wrap">
                        <div className="menu-top">
                            <div className="menu-top-info">
                            </div>
                        </div>
                        <div className="menu-content">
                            <div className="menu-content-inner">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = NavBar;