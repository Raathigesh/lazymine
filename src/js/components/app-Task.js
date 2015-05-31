/*global require, module, openExternalUrl, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
    AppActions = require('../actions/app-actions'),
    TextField = require('../components/form/app-TextField'),
    DropDown = require('../components/form/app-Dropdown');

var Task = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            open: false
        };
    },
    _handleClick: function () {
        "use strict";
        if (this.state.open) {
            this.setState({
                open: false
            });
        } else {
            this.setState({
                open: true
            });
        }
    },
    _elementClick: function (event) {
        "use strict";
        event.stopPropagation();
    },
    _updateTaskActivityId: function (event) {
        "use strict";
        var activityId = this.refs.activity.getValue();
        AppActions.updateTaskActivityId(this.props.item.id, activityId);
        event.stopPropagation();
    },
    _updateTaskComments: function (comment) {
        "use strict";
        AppActions.updateTaskComments(this.props.item.id, comment);
    },
    _updateTaskHours: function (event) {
        "use strict";
        var spentHours = this.refs.spentHours.getValue();
        AppActions.updateTaskHours(this.props.item.id, spentHours);
    },
    _remove: function (event) {
        "use strict";
        AppActions.removeTimeEntry(this.props.item.id);
        event.nativeEvent.stopImmediatePropagation();
    },
    _openExternalUrl: function (event) {
        "use strict";
        openExternalUrl(this.props.item.taskUrl);
        minimizeWindow();
        event.nativeEvent.stopImmediatePropagation();
    },
    render : function () {
        "use strict";
        var activities = this.props.activities,
            item = this.props.item,
            tileClass = "tile tile-collapse",
            hoursText = "",
            iconText,
            dataTarget;

        if (item.updated) {
            tileClass = "tile tile-collapse selected";
            hoursText = "[" + parseFloat(item.hours).toFixed(2) + " Hours]";
        }

        // Just get the first proper letter of the project
        iconText = this.props.item.projectName.replace(/\W/g, '').charAt(0);
        dataTarget = "tile-collapse-" + item.id;

        return (
            <div className={tileClass}>
                <div className="tile-toggle" data-target={"#" + dataTarget} data-toggle="tile" data-parent="body">
                    <div className="pull-left tile-side">
                        <div className="avatar avatar-sm avatar-multi">
                            <span className="" title={this.props.item.projectName}>{iconText}</span>
                        </div>
                    </div>

                    <div className="tile-action tile-action-show">
                        <ul className="nav nav-list pull-right">
                            <li>
                                <a onClick={this._openExternalUrl} href="#"><span className="access-hide">IssueID</span><span className="icon icon-launch"></span></a>
                            </li>
                            <li>
                                <a href="javascript:void(0);" onClick={this._remove}><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className="pull-right tile-hours">
                            <li>
                                <span>{hoursText}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="tile-inner">
                        <div className="text-overflow">{item.issueName}</div>
                    </div>
                </div>
                <div className="tile-active-show collapse" id={dataTarget}>
                    <div className="tile-sub">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12">
                                <TextField ref="comment" label = "Comment" value={item.comments} keyUp={this._updateTaskComments}/>
                            </div>    
                        </div>
                        <div className="row">
                             <div className="col-lg-6 col-sm-6 tracker-dropdown">
                                <DropDown ref="activity" data={activities} initialValue={item.activityId} onChange={this._updateTaskActivityId}/>
                             </div>
                             <div className="col-lg-6 col-sm-6 hours-input">
                                <TextField ref="spentHours" label = "Hours" value={item.hours} keyUp={this._updateTaskHours} isNumeric={true} setFixedFloatingZeros={true}/>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

//fix from
// http://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
$(function(){
    $('.icon-launch').on('click', function(e){
        e.stopPropagation();
    });
    $('.icon-delete').on('click', function(e){
        e.stopPropagation();
    });
});

module.exports = Task;
