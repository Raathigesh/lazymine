/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');
var TextField = require('../components/form/app-TextField');
var Dropdown = require('../components/form/app-Dropdown');

var Task = React.createClass({

    getInitialState: function() {
        return {
            open:false
        };
    },

    _handleClick: function(event) {
        if(this.state.open) {
            this.setState({
                open: false
            });
        }else{
            this.setState({
                open: true
            });
        }
    },

    _elementClick: function(event){
        event.stopPropagation();
    },

    _hourEntered: function(event){
		var spentHours = parseFloat(this.refs.spentHours.getValue());
        var comment = this.refs.comment.getValue();
        var activityId = this.refs.activity.getValue();
        AppActions.updateTime(this.props.item.id, activityId, spentHours, comment);
        event.stopPropagation();
    },

    _remove: function(){
        AppActions.removeTimeEntry(this.props.item.id);
    },
  
    render : function(){
        var activities = this.props.activities,
            item = this.props.item,
            tileClass = "tile tile-collapse",
            hoursText = "";

        if (item.updated) {
            tileClass = "tile tile-collapse selected";
            hoursText = "[" + item.hours + " Hours]"
        }

        // Just get the first proper letter of the project
        var icontext = this.props.item.projectName.replace(/[^a-z]/gi,'').charAt(0);

        var dataTarget = "tile-collapse-" + item.id;

        return (
            <div className={tileClass}>
                <div className="tile-toggle" data-target={"#" + dataTarget} data-toggle="tile" data-parent="body">
                    <div className="pull-left tile-side">
                        <div className="avatar avatar-sm avatar-multi">
                            <span className="icon">{icontext}</span>
                        </div>
                    </div>

                    <div className="tile-action tile-action-show">
                        <ul className="nav nav-list pull-right">
                            <li>
                                <a href="javascript:void(0)" onClick={this._remove}><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
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
                                <TextField ref="comment" label = "Comment"/> 
                            </div>    
                        </div>
                        <div className="row">
                             <div className="col-lg-6 col-sm-6 tracker-dropdown">
                                <Dropdown ref="activity" data={activities}/>
                             </div>
                             <div className="col-lg-6 col-sm-6 hours-input">
                                <TextField ref="spentHours" label = "Hours" keyUp={this._hourEntered}/>
                             </div>                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Task;
