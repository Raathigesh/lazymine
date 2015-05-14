/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({
  render : function(){
    return (
      <header className="header navbar navbar-default">
          <ul className="nav nav-list pull-left">
              <li>
                  <a className="menu-toggle" href="#navBar">
                      <span className="access-hide">Menu</span>
                      <span className="icon icon-menu icon-lg"></span>
                  </a>
              </li>
          </ul>
        	<a className="navbar-brand" href="#">
            	<img src="assets/top-logo.png" />
            </a>
      </header>
    );
  }
});

module.exports = Header;