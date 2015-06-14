/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    CustomField = require('./form/app-CustomField');

var CustomFields = React.createClass({
    propTypes: {
        fields:  React.PropTypes.array.isRequired // Custom fields that should be rendered
    }, 
    onUpdate: function(){

    },
    render : function () {
        "use strict";
        
        var fields = null;

        fields = this.props.fields.map(function(item){
            return <CustomField field={item} />;
        });       

        return (
                <div>
                    {fields}
                </div>            
            );
    }
});

module.exports = CustomFields;