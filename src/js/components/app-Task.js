/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var DropDownMenu = Mui.DropDownMenu;
var DatePicker = Mui.DatePicker;
var TextField = Mui.TextField;
var tweenState = require('react-tween-state');
var AppActions = require('../actions/app-actions');

var Task = React.createClass({

  mixins: [tweenState.Mixin],

  activityId: 0,

  handleClick: function() {
    this.tweenState('height', {
      easing: tweenState.easingTypes.easeInOutQuad,
      duration: 500,
      beginValue:  this.state.height === 96 ? 96 : 245,
      endValue: this.state.height === 96 ? 245 : 245
    });
  },

  elementClick: function(event){
    event.stopPropagation();
  },

  activityChanged: function(e, selectedIndex, menuItem){
    debugger
    this.activityId = menuItem.id;
  },

  hourEntered: function(event){
    debugger
    var spentHours = this.refs.spentHours.getValue();
    debugger
    AppActions.updateTime(this.props.item.id, this.activityId, spentHours);
    event.stopPropagation();
  },

  getInitialState: function() {
    return {
      height: 96
      };
  },
  
  render : function(){
    
    var activities = this.props.activities;
    var item = this.props.item;   
    var classes = "list-group-item";

    if(item.hasOwnProperty("time_updated") && item.time_updated == true){
      classes = "list-group-item updated";
    }

    var style = {
      height: this.getTweeningValue('height')
    };

    return (
        <div style={style} onClick={this.handleClick} className={classes}>
            <div className="row-action-primary">
                <i>F</i>
            </div>
            <div className="row-content">
                <div className="least-content">{this.props.updatedTime} mins ago </div>
                <h4 className="list-group-item-heading">{this.props.projectName}</h4>
                <p className="list-group-item-text">{this.props.taskName}</p>
            </div>
            <div className="row-content task-input">
                <div className="col-xs-12">
                  <TextField hintText="Comment" className="comment-box" onClick={this.elementClick}/>
                </div>
            </div>
            <div className="row-content task-input">
              <DropDownMenu menuItems={activities} className="tracker-dropdown" onClick={this.elementClick} onChange={this.activityChanged}/>
              <TextField ref="spentHours" hintText="Hours" className="hours-input" onClick={this.elementClick} onBlur={this.hourEntered}/>
            </div>
        </div>
      );
    }
});

module.exports = Task;
