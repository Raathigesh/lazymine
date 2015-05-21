/** @jsx React.DOM */
var React = require('react'),
    Validator = require('validator');

var TextField = React.createClass({
    formNormalClasses: "form-group form-group-label",
    formNormalClassesFocus: "form-group form-group-label control-focus",
    formErrorClassesFocus: "form-group form-group-label form-group-red control-focus",
    isNumeric: false,
    setFixedFloatingZeros: false,
    keyUpEvent: null,
    getTextBox: function () {
        return React.findDOMNode(this.refs.textBox);
    },
    getValue: function (){
        return React.findDOMNode(this.refs.textBox).value;
    },
    getInitialState: function () {
        var intialClass =  this.formNormalClasses;

        if(this.props.value != null){
            intialClass =  this.formNormalClasses + " control-highlight"
        }

        return {
            "formClassCollection": intialClass
        };
    },
    keyUpEventBase: function (event) {
        if(this.isNumeric) {
            var value = this.getValue();
            if (value === "" || Validator.isInt(value, { min: 0 }) || Validator.isFloat(value, { min: 0.00 })) {
                this.setState({
                    "formClassCollection": this.formNormalClassesFocus
                });
            } else {
                this.setState({
                    "formClassCollection": this.formErrorClassesFocus
                });
            }
        }
    },
    valueChange: function(event){
        this.keyUpEvent(event.target.value);
    },
    blurEventBase: function (event) {
        if (this.setFixedFloatingZeros) {
            var textBox = this.getTextBox();
            if (Validator.isInt(textBox.value) || Validator.isFloat(textBox.value)) {
                textBox.value = parseFloat(textBox.value).toFixed(2);
            }
        }
    },
    render : function(){
        this.isNumeric = this.props.isNumeric;
        this.setFixedFloatingZeros = this.props.setFixedFloatingZeros;
        this.keyUpEvent = this.props.keyUp;
        return (
           <div className={this.state.formClassCollection}>
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <label className="floating-label" for="float-text">{this.props.label}</label>
                  <input ref="textBox" className="form-control" id="float-text" value={this.props.value} type="text" onKeyUp={this.keyUpEventBase} onBlur={this.blurEventBase} onChange={this.valueChange}/>
                </div>
              </div>
           </div>
        );
    }
});

module.exports = TextField;