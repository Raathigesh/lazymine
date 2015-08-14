/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var WeeklyViewDay = React.createClass({
    render: function () {
        "use strict";
        return (
            <div className="tile tile-collapse">
                <div className="card-action">
                    <div className="pull-left tile-side">
                        <div className="avatar avatar-sm avatar-multi">
                            <span className="">{this.props.iconText}</span> 
                        </div>
                    </div>
                    <div className="tile-action tile-action-show">
                        {this.props.hours}h
                    </div>
                    <div class="tile-inner">
                        <div class="text-overflow">
                            {this.props.taskName}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WeeklyViewDay;