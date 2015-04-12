/** @jsx React.DOM */
var React = require('react');

var Title = React.createClass({
  componentWillMount: function () {
  },
  render : function(){
    return (
      <div className="col-md-12">
            <h4>{this.props.text}</h4>
      </div>
    );
  }
});

module.exports = Title;
