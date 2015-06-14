/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    TextField = require('./app-TextField'),
    DropDown = require('./app-Dropdown');

var CustomField = React.createClass({
    onUpdate: function(){

    },
    render : function () {
        "use strict";
        
        var component = null;

        if(this.props.field.field_format === "list"){

            var dropdownValues = this.props.field.possible_values.possible_values.map(function(item, i){
                return {
                    id: i,
                    text: item.value
                };
            });           

            component = <DropDown data={dropdownValues} label={this.props.field.name} onChange={this.onUpdate}/>;
        }
        else{
            component = <TextField label={this.props.field.name} onChange={this.onUpdate} />;   
        }

        return (
            <div className="row">
                <div className="col-lg-12 col-sm-12">
                  {component}
                </div>
            </div>
        );
    }
});

module.exports = CustomField;