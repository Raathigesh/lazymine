/** @jsx React.DOM */
var React = require('react');
var Task = require('../components/app-Task');
var AppStore = require('../stores/app-base-store');

var TaskList = React.createClass({
  
  getInitialState: function () {
    return {
     "items": null
    };
  },
  
  render : function(){
    var rows,
        items = this.props.items,
        activities = this.props.activities;

    if(items){
      rows = items.map(function(item, i) {
        return(          
            <Task updatedTime="15" item={item} activities={activities} /> 
        );
      });
    }

    return (
        <div className="tile-wrap">
           {rows}
        </div>
    );
  }
});

module.exports = TaskList;
