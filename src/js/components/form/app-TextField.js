/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Validator = require('validator'),
    easyGid = require("easy-guid");

var TextField = React.createClass({
    formNormalClasses: "form-group form-group-label",
    formNormalClassesFocus: "form-group form-group-label control-focus",
    localValue: null,
    getValue: function (){
        return React.findDOMNode(this.refs.textBox).value;
    },

    getInitialState: function () {
        "use strict";
        var intialClass =  this.formNormalClasses;

        if (this.props.value !== null) {
            intialClass =  this.formNormalClasses + " control-highlight";
        }

        return {
            "formClassCollection": intialClass
        };
    },

    valueChange: function(event){        
        var value = this.getValue();
        this.localValue = value;
        if(this.props.isNumeric) {
            if (value === "" || Validator.isInt(value, { min: 0 }) || Validator.isFloat(value, { min: 0.00 })) {
                this.setState({
                    "formClassCollection": this.formNormalClassesFocus
                });
                this.props.keyUp(value);
            } else {
               
            }
        }
    },

    onLoosingFocus: function(event){
         var value = this.getValue();

         if(value != ""){
            this.setState({
                "formClassCollection": this.formNormalClassesFocus + " control-highlight"
            });
         }
    }, 

    render : function(){
	    var identifier = easyGid.new();
        var textBoxValue = (this.localValue !== this.props.value) ? this.localValue : this.props.value;
        textBoxValue = textBoxValue == 0 ? "" : textBoxValue;

        return (
           <div className={this.state.formClassCollection}>
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <label className="floating-label" htmlFor={identifier}>{this.props.label}</label>
                  <input ref="textBox" className="form-control" id={identifier} value={textBoxValue} type="text" onBlur={this.onLoosingFocus} onChange={this.valueChange}/>
                </div>
              </div>
           </div>
        );
    }
});

module.exports = TextField;