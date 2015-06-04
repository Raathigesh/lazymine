/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
Task = require('../components/app-Task'),
AppStore = require('../stores/app-base-store');

var TaskList = React.createClass({
    getInitialState: function () {
        "use strict";

        var height = {
          'height': document.documentElement.clientHeight - 140
      };

        return {
            "items": null,
            "componentHeight": height
        };
    },

    handleResize: function(e) {
        var height = {
          'height': document.documentElement.clientHeight - 140
      };

      this.setState({componentHeight: height});
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  render : function () {
    "use strict";
    var rows,
    items = this.props.items,
    activities = this.props.activities;

    if (items) {
        rows = items.map(function (item) {
            return(<Task updatedTime="15" item={item} activities={activities} />);
        });
    }

    return (
        <div className="tile-wrap" style={this.state.componentHeight}>
        {rows}
        </div>
    );
  }
});

module.exports = TaskList;
