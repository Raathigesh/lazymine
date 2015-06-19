/*global require, module*/
/** @jsx React.DOM */
var React = require('react');
var RadioButton = require('./app-RadioButton');
var AppActions = require('../../actions/app-actions');
var easyGid = require("easy-guid");

var ColorControl = React.createClass({
    propTypes: {
        field:  React.PropTypes.object.isRequired, // Custom filed object
        issue:  React.PropTypes.object.isRequired
    },
    onChange: function(data){
        AppActions.updateTaskCustomField(this.props.issue.id, this.props.field.id, data.label);
    },        
    render : function () {
        "use strict";
        
        var uniqueName = easyGid.new();
        
        var radioButtons = this.props.field.possible_values.possible_values.map(function(item, i){
                var isChecked = (issue.customFields[0].id === item.id);

                return <RadioButton name={uniqueName} label={item.value} labelColor={item.color} onChange ={this.onChange} isChecked={isChecked}/>;
        }.bind(this));           

        return (
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12 form-group">
                  {radioButtons}
                </div>
            </div>
        );
    }
});

module.exports = ColorControl;
