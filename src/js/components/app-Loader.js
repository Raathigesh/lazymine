/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Loader = React.createClass({

  getInitialState: function () {
      return {
        "show" : false
      };
  },

  _toggle: function(show){
      this.setState({
        "show" : show
      });
  },

  render : function(){

    var overlay = null;

    if(this.props.isLoading){
        overlay = <div className="overlay"></div>;
    }

    return (      
      <div>   
        {{overlay}}
        {this.props.children}        
      </div>      
    );
  }
});

module.exports = Loader; 