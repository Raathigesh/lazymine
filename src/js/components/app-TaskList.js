/** @jsx React.DOM */
var React = require('react');
var Task = require('../components/app-Task');
var AppStore = require('../stores/app-store-base');

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
          <div>
            <Task updatedTime="15" item={item} activities={activities}/>
            <div className="list-group-separator"></div>
          </div>
        );
      });
    }

    return (
        <div className="list-group">
           {rows}
        </div>
    );
  }
});

module.exports = TaskList;
