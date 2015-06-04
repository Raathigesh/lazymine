/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Validator = require('validator'),
    easyGid = require("easy-guid"),
    _ = require('lodash');

var TextField = React.createClass({
    formNormalClasses: "form-group form-group-label",
    formNormalClassesFocus: "form-group form-group-label control-focus",
    isPointRequired: false,
    getValue: function (){
        return React.findDOMNode(this.refs.textBox).value;
    },

    getInitialState: function () {
        "use strict";
        var intialClass =  this.formNormalClasses;

        if (this.props.value !== null || this.props.value === "") {
            
            intialClass =  this.formNormalClasses + " control-highlight";
        }

        return {
            formClassCollection: intialClass
        };
    },

    valueChange: function(event){        
        var value = this.getValue();

        if(this.props.isNumeric) {
           value = (value === "") ? 0 : value;
        }
        
        if(this.props.isNumeric){
            if(_.endsWith(value, '.')){
                this.isPointRequired = true;
               // value = parseInt(value).toFixed(2);
                this.props.onChange(value);    
            }
            else{
                this.isPointRequired = false;
                this.props.onChange(value);
            }            
        } else {
             this.props.onChange(value);   
        }    
    },

    onLoosingFocus: function(event){
         var value = this.getValue();
         if(value !== ""){
            this.setState({
                "formClassCollection": this.formNormalClassesFocus + " control-highlight"
            });
         }
    }, 

    render : function(){
	    var identifier = easyGid.new();        
        var textValue = (this.isPointRequired) ? this.props.value + "." : this.props.value;
        textValue = (textValue === 0) ? "" : textValue;
        return (
           <div className={this.state.formClassCollection}>
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <label className="floating-label" htmlFor={identifier}>{this.props.label}</label>
                  <input ref="textBox" className="form-control" id={identifier} value={textValue} type="text" onBlur={this.onLoosingFocus} onChange={this.valueChange}/>
                </div>
              </div>
           </div>
        );
    }
});

module.exports = TextField;