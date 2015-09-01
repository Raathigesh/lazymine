/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
randomMC = require('random-material-color');

var WeeklyViewDay = React.createClass({
    
    render: function () {
        "use strict";

        var iconStyle = {
            backgroundColor: randomMC.getColor({ text: this.props.taskName })
        };

        return (
 <div className="tile tile-collapse">
    <div className="tile-toggle">
        <div className="pull-left tile-side">
            <div className="avatar avatar-sm avatar-multi" title={this.props.taskName} style={iconStyle}>
                <span className="">{this.props.iconText}</span> 
            </div>
        </div>
        <div className="tile-inner" title={this.props.taskName}>
            <div className="text-overflow">{this.props.taskName}</div>
        </div>
    </div>
</div>
);
    }
});

module.exports = WeeklyViewDay;