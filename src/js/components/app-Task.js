/*global require, module, openExternalUrl, minimizeWindow*/
/** @jsx React.DOM */
var React = require('react'),
    randomMC = require('random-material-color'),
    AppActions = require('../actions/app-actions'),
    TextField = require('../components/form/app-TextField'),
    DropDown = require('../components/form/app-Dropdown'),
    CustomFields = require('./app-CustomFields');

var Task = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            open: false
        };
    },
    _handleClick: function () {
        "use strict";
        var state;
        if (this.state.open) {
            state = {
                open: false
            };
        } else {
            state = {
                open: true
            };
        }

        if (this.isMounted()) {
            this.setState(state);
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
    _updateTaskHours: function (hours) {
        "use strict";
        AppActions.updateTaskHours(this.props.item.id, hours);
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
    _getIconText: function(){
        // get the first word character of, first two words"
        var iconText = '';
        var words = this.props.item.projectName.split(" ");
        if(words.length >=2){
            var firstChar = words[0].replace(/\W/g, '').charAt(0);
            var secondChar = words[1].replace(/\W/g, '').charAt(0);
            iconText = firstChar + secondChar
        }
        else if(words.length == 1){
            iconText = words[0].replace(/\W/g, '');
            iconText = iconText.length>2?iconText.substring(0,2):iconText;
        }
        return iconText.toUpperCase();
    },
    render : function () {
        "use strict";
        var activities = this.props.activities,
            item = this.props.item,
            tileClass = "tile tile-collapse",
            hoursText = "",
            iconText,
            dataTarget,
            iconStyle;

        if (item.updated) {
            tileClass = "tile tile-collapse selected";
            hoursText = "[" + parseFloat(item.hours).toFixed(2) + " Hours]";
        }

        // Just get the first proper letter of the project
        iconText = this._getIconText();
        dataTarget = "tile-collapse-" + item.id;

        //debugger;
        iconStyle = {
            backgroundColor: randomMC.getColor({ text: this.props.item.projectName })
        };

        return (
            <div className={tileClass}>
                <div className="tile-toggle" data-target={"#" + dataTarget} data-toggle="tile" data-parent="body">
                    <div className="pull-left tile-side">
                        <div className="avatar avatar-sm avatar-multi" title={this.props.item.projectName} style={iconStyle}>
                            <span className="">{iconText}</span> 
                        </div>
                    </div>

                    <div className="tile-action tile-action-show">
                        <ul className="nav nav-list pull-right">
                            <li title={"Open task #" + item.issueId + " in Redmine"}>
                                <a onClick={this._openExternalUrl} href="#"><span className="access-hide">IssueID</span><span className="icon icon-launch task-icon"></span></a>
                            </li>
                            <li title="Remove task">
                                <a href="javascript:void(0);" onClick={this._remove}><span className="access-hide">Delete</span><span className="icon icon-delete task-icon"></span></a>
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
                    <div className="tile-inner" title={item.issueName}>
                        <div className="text-overflow">{item.issueName}</div>
                    </div>
                </div>
                <div className="tile-active-show collapse" id={dataTarget}>
                    <div className="tile-sub">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12">
                                <TextField ref="comment" label = "Comment" value={item.comments} onChange={this._updateTaskComments}/>
                            </div>    
                        </div>
                        <div className="row">
                             <div className="col-xs-6 tracker-dropdown">
                                <DropDown ref="activity" data={activities} initialValue={item.activityId} label="Activity" onChange={this._updateTaskActivityId}/>
                             </div>
                             <div className="col-xs-6 hours-input">
                                <TextField ref="spentHours" label = "Hours" value={item.hours} onChange={this._updateTaskHours} isNumeric={true}/>
                             </div>
                        </div>
                        <CustomFields issue={item} fields={this.props.customFields}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Task;
