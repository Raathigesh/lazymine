/** @jsx React.DOM */
var React = require('react');
var Task = require('../components/app-Task');
var AppStore = require('../stores/app-store');

var TaskList = React.createClass({
  _change: function (payload) {
    var activeTaskProcess = AppStore.getActiveTaskProcess();
    if(activeTaskProcess){
      this.setState({
        "Items": activeTaskProcess.data
      });
    }
  },
  componentWillMount: function () {
      AppStore.addChangeListener(this._change);
  },
  // Initial states with no items
  getInitialState: function () {
    return {
     "Items": null
    };
  },
  render : function(){
    var rows,
        items = this.state.Items;

    if(items){
      rows = items.map(function(item, i) {
        return(
          <div>
          <Task updatedTime="15" projectName={item.project.name} taskName={item.subject}/>
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
