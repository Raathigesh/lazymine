/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var WeeklyViewDayHeader = React.createClass({
    render: function () {
        "use strict";
        return (
           <div className="daily-time-total">
                <span className="text-left">
                    {this.props.day}
                </span>
                <span className="pull-right">
                    {this.props.totalHours}h
                </span>
            </div>
        );
    }
});

module.exports = WeeklyViewDayHeader;