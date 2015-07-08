/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    TextField = require('./app-TextField'),
    DropDown = require('./app-Dropdown'),
    ColorControl = require('./app-ColorControl');

var CustomField = React.createClass({
    propTypes: {
        field:  React.PropTypes.object.isRequired, // Custom filed object
        issue:  React.PropTypes.object.isRequired,
        onUpdate: React.PropTypes.func
    },        
    onUpdate: function(){     
        var value   =  this.refs.field.getValue();
        this.props.onUpdate(value);
    },
    render : function () {
        "use strict"; 
        
        var component = null;

        if(this.props.field.field_format === "list"){

            var isCustomColorControlRequired = (this.props.field.possible_values.possible_values[0].color) ? true : false;

            if(isCustomColorControlRequired){
                component = <ColorControl issue={this.props.issue} field={this.props.field} />;
            }
            else{
                var dropdownValues = this.props.field.possible_values.possible_values.map(function(item, i){
                    return {
                        id: item.value,
                        text: item.value
                    };
                });           

                component = <DropDown ref="field" data={dropdownValues} label={this.props.field.name} onChange={this.onUpdate}/>;
            }           
        }
        else{
            component = <TextField ref="field" label={this.props.field.name} onChange={this.onUpdate} />;   
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