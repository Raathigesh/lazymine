/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Loader = React.createClass({
  render : function(){

    var overlay = null;

    if(this.props.isLoading){
        overlay = <div className="overlay"><div><img src="assets/Cat.GIF"/> Loading...</div></div>;
    }

    return (      
      <div>   
        {{overlay}}
      </div>      
    );
  }
});

module.exports = Loader; 