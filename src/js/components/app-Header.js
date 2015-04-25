/** @jsx React.DOM */
var React = require('react');

var Header = React.createClass({
  render : function(){
    return (
      <nav className="navbar navbar-default">
          <div className="navbar-header">
            <a className="navbar-brand" href="#"><img src="assets/top-logo.png" /></a>
          </div>
      </nav>
    );
  }
});

module.exports = Header;
