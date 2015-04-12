/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var DropDownMenu = Mui.DropDownMenu;
var DatePicker = Mui.DatePicker;
var TextField = Mui.TextField;
var tweenState = require('react-tween-state');

var Task = React.createClass({
mixins: [tweenState.Mixin],
handleClick: function() {
    this.tweenState('height', {
      easing: tweenState.easingTypes.easeInOutQuad,
      duration: 500,
      beginValue:  this.state.height === 96 ? 96 : 245,
      endValue: this.state.height === 96 ? 245 : 96
    });
  },
  elementClick: function(event){
    var state = this.state;
    state.classes = "list-group-item updated";
    this.setState(state);
    event.stopPropagation();
  },
  getInitialState: function() {
    return {
      height: 96,
      classes: "list-group-item"
      };
  },
render : function(){
  var item = this.props.item;
  var menuItems = [
   { payload: '1', text: 'Requirement' },
   { payload: '2', text: 'Design' },
   { payload: '3', text: 'Developement' },
   { payload: '4', text: 'Documentation' },
   { payload: '5', text: 'Defect Fixing' },
];

var style = {
  height: this.getTweeningValue('height')
};

  return (
    <div style={style} onClick={this.handleClick} className={this.state.classes}>
        <div className="row-action-primary">
            <i>F</i>
        </div>
        <div className="row-content">
            <div className="least-content">{this.props.updatedTime} mins ago </div>
            <h4 className="list-group-item-heading">{this.props.projectName}</h4>
            <p className="list-group-item-text">{this.props.taskName}</p>
        </div>
        <div className="row-content">
            <TextField hintText="Comment" className="comment-box" onClick={this.elementClick}/>
        </div>
        <div className="row-content">
          <DropDownMenu menuItems={menuItems} autoWidth="false" onClick={this.elementClick}/>
          <TextField hintText="Hours" onClick={this.elementClick}/>
        </div>
    </div>
  );
}
});

module.exports = Task;
