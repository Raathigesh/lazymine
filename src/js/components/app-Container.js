/** @jsx React.DOM */
var React = require('react');
var SearchBox = require('../components/app-SearchBox');
var Title = require('../components/app-Title');
var TaskList = require('../components/app-TaskList');
var Footer = require('../components/app-Footer');

var Container = React.createClass({
  componentWillMount: function () {
  },
  render : function(){
    return (
      <div>
      <div className="container-fluid">
        <div className="row">
          <SearchBox/>
          <Title text="LATEST TASKS ASSIGNED TO YOU"/>
          <Title text="LAST TIME ENTERED TASKS"/>
          <TaskList/>
        </div>
      </div>
      <Footer/>
      </div>
    );
  }
});

module.exports = Container;
