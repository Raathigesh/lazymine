/*global require, module, openExternalUrl, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
  AppActions = require('../actions/app-actions'),
  randomMC = require('random-material-color');

var WeeklyViewDay = React.createClass({
    _openExternalUrl: function (event) {
        "use strict";
        openExternalUrl(this.props.timeEntryUrl);
        minimizeWindow();
        event.nativeEvent.stopImmediatePropagation();
    },
    _remove: function (event) {
        "use strict";
        AppActions.deleteTimeEntry(this.props.entryId);
        event.nativeEvent.stopImmediatePropagation();
    },
    render: function () {
        "use strict";
        var project = this.props.projectName || '-';
        var iconStyle = {
            backgroundColor: randomMC.getColor({ text: project })
        };

        return (
 <div className="tile tile-collapse">
    <div className="tile-toggle">
        <div className="pull-left tile-side">
            <div className="avatar avatar-sm avatar-multi" title={this.props.projectName} style={iconStyle}>
                <span>{this.props.iconText}</span>
            </div>
        </div>
        <div className="tile-action tile-action-show">
            <ul className="nav nav-list pull-right">
                <li title={"Open time entry in Redmine"}>
                    <a onClick={this._openExternalUrl} href="#"><span className="icon icon-launch task-icon"></span></a>
                </li>
                <li title="Remove task">
                    <a href="javascript:void(0);" onClick={this._remove}><span className="access-hide">Delete</span><span className="icon icon-delete task-icon"></span></a>
                </li>
            </ul>
        </div>
        <div className="tile-inner" title={this.props.taskName}>
            <div className="text-overflow">
            {this.props.taskName}
            <span className="nav nav-list pull-right">
                {this.props.hours}h
            </span>
            </div>
        </div>
    </div>
</div>
);
    }
});

module.exports = WeeklyViewDay;
