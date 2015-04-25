/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var SearchBox = require('../components/app-SearchBox');
var Title = require('../components/app-Title');
var TaskList = require('../components/app-TaskList');
var Footer = require('../components/app-Footer');

var Container = React.createClass({
  _change: function () {    
      var storeState = AppStore.getState();
      this.setState(storeState);
  },

  componentWillMount: function () {
      AppStore.addChangeListener(this._change);
      AppActions.fetchIssues();
  },

  getInitialState: function () {    
      var s =   AppStore.getState();
      return s;
  },
  
  render : function(){
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <SearchBox items={this.state.filteredResult}/>
            <Title text="LAST TIME ENTERED TASKS"/>
            <TaskList items={this.state.activeItems} activities={this.state.activities}/>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = Container;
