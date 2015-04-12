/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var Paper = Mui.Paper;
var TextField = Mui.TextField;
var DropDownMenu = Mui.DropDownMenu;
var DatePicker = Mui.DatePicker;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;

var Task = React.createClass({

render : function(){
  var item = this.props.item;
  var menuItems = [
   { payload: '1', text: 'Requirement' },
   { payload: '2', text: 'Design' },
   { payload: '3', text: 'Developement' },
   { payload: '4', text: 'Documentation' },
   { payload: '5', text: 'Defect Fixing' },
];
  return (
  /*  <div className="col-xs-12 task">
      <div className="row taskHeader">
        <div className="col-xs-12 taskHeader">{item.subject}</div>
      </div>
      <div className="row">
          <div className="col-xs-12">
            <TextField hintText="Comment" />
          </div>
      </div>
      <div className="row">
        <div className="col-xs-6 activity">
          <TextField hintText="Hours" />
        </div>
        <div className="col-xs-6">
          <DropDownMenu menuItems={menuItems} autoWidth="false"/>
        </div>
      </div>
    </div>*/
    <div className="list-group-item">
        <div className="row-action-primary">
            <i>F</i>
        </div>
        <div className="row-content">
            <div className="least-content">{this.props.updatedTime} mins ago </div>
            <h4 className="list-group-item-heading">{this.props.projectName}</h4>
            <p className="list-group-item-text">{this.props.taskName}</p>
        </div>
    </div>
  );
}
});

module.exports = Task;
