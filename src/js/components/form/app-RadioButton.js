/*global require, module*/
/** @jsx React.DOM */
var React = require('react');

var RadioButton = React.createClass({
    propTypes: {
        label:  React.PropTypes.string, // label of the radio button
        labelColor: React.PropTypes.string, // color of the radio button's label
        onChange : React.PropTypes.func
    },
    onChange: function(event){
        var isSelected = React.findDOMNode(this.refs.radioButton).checked;

        if (this.props.onChange) {
            this.props.onChange({
                label: this.props.label,
                isSelected: isSelected
            });
        }
    },
    render : function () {
        "use strict";      

        var radioLabelColor = {
          color: this.props.labelColor
        };

        return (
            <div className="radio radio-adv radio-inline">
                <label for="input-radio-1" style={radioLabelColor}>
                    <input ref="radioButton" className="access-hide" id="input-radio-1" name="input-radio" type="radio" onChange={this.onChange} >
                        {this.props.label}
                    </input>
                    <span className="circle"></span>
                    <span className="circle-check"></span>
                </label>
            </div>
        );
    }
});

module.exports = RadioButton;
