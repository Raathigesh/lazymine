/** @jsx React.DOM */
var React = require('react');
var Task = require('../components/app-Task.js');

var TaskList = React.createClass({

render : function(){
  return (
    <Task/>
  );
}
});

module.exports = TaskList;
