/** @jsx React.DOM */
var React = require('react');
var Task = require('../components/app-Task');
var AppStore = require('../stores/app-store');

var TaskList = React.createClass({
  _change: function () {
    var data = AppStore.getSelectedIssues();
    this.setState({
      "Items" :  data
    });
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
          <Task item={item}/>
        );
      });
    }

    return (
        <div>
           {rows}
        </div>
    );
  }
});

module.exports = TaskList;
