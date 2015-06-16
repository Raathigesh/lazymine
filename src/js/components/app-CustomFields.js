/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    CustomField = require('./form/app-CustomField');

    //var reader = require('../../stores/custom-fields-reader');

var CustomFields = React.createClass({
    propTypes: {
        fields:  React.PropTypes.array.isRequired, // Custom fields that should be rendered
        issue:  React.PropTypes.object.isRequired
    }, 
    onUpdate: function(value){
     /*   var read = new reader();
        read.Read();*/
        debugger
    },
    render : function () {
        "use strict";
        
        var fields = null;

        fields = this.props.fields.map(function(item){
            return <CustomField issue={this.props.issue} field={item} onUpdate={this.onUpdate}/>;
        }.bind(this));       

        return (
                <div>
                    {fields}
                </div>            
            );
    }
});

module.exports = CustomFields;