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
        debugger
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
        var activities = this.props.activities;
        var item = this.props.item;

        // Just get the first proper letter of the project
        var icontext = this.props.item.projectName.replace(/[^a-z]/gi,'').charAt(0);

        var dataTarget = "tile-collapse-" + item.id;

        return (
            <div className="tile tile-collapse">
                <div className="tile-toggle" data-target={"#" + dataTarget} data-toggle="tile">
                    <div className="pull-left tile-side">
                        <div className="avatar avatar-blue avatar-sm">
                            <span className="icon icon-alarm"></span>
                        </div>
                    </div>
                    <div className="tile-action" data-ignore="tile">
                        <ul className="nav nav-list pull-right">
                            <li>
                                <a href="javascript:void(0)" onClick={this._remove}><span className="access-hide">Delete</span><span className="icon icon-delete"></span></a>
                            </li>                 
                        </ul>
                    </div>
                    <div className="tile-inner">
                        <div className="text-overflow">{item.issueName}</div>
                    </div>
                </div>
                <div className="tile-active-show collapse" id={dataTarget}>
                    <div className="tile-sub">
                        <p className="expanded-details">{item.projectName}<br/><small>{item.issueName}</small></p>
                        <div className="row">
                            <div className="col-lg-12 col-sm-12">
                                <TextField ref="comment" label = "Comment"/> 
                            </div>    
                        </div>
                        <div className="row">
                             <div className="col-lg-6 col-sm-6">
                                <Dropdown ref="activity" data={activities}/>
                             </div>
                             <div className="col-lg-6 col-sm-6">
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
