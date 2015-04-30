/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = React.createClass({
  render : function(){
    return (
      <nav className="navbar navbar-default">
          <div className="navbar-header">
        	<a className="navbar-brand" href="#/setting">
            	<img src="assets/top-logo.png" />
            </a>            
          </div>
      </nav>
    );
  }
});

module.exports = Header;