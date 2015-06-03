/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Task = require('../components/app-Task'),
    AppStore = require('../stores/app-base-store');

var TaskList = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            "items": null,
            "containerHeight": 0
        };
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

    var containerHeight = {
      height: document.documentElement.clientHeight - 138
    };
        return (
            <div className="tile-wrap" style={containerHeight}>
               {rows}
            </div>
        );
    }
});

module.exports = TaskList;
