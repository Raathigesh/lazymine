/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Validator = require('validator'),
    easyGid = require("easy-guid");

var TextField = React.createClass({
    formNormalClasses: "form-group form-group-label",
    formNormalClassesFocus: "form-group form-group-label control-focus",
    formErrorClassesFocus: "form-group form-group-label form-group-red control-focus",
    isNumeric: false,
    setFixedFloatingZeros: false,
    keyUpEvent: null,
    getTextBox: function () {
        "use strict";
        return React.findDOMNode(this.refs.textBox);
    },
    getValue: function () {
        "use strict";
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
    keyUpEventBase: function (event) {
        "use strict";
        if (this.isNumeric) {
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
    valueChange: function (event) {
        "use strict";
        this.keyUpEvent(event.target.value);
    },
    blurEventBase: function (event) {
        "use strict";
        if (this.setFixedFloatingZeros) {
            var textBox = this.getTextBox();
            if (Validator.isInt(textBox.value) || Validator.isFloat(textBox.value)) {
                textBox.value = parseFloat(textBox.value).toFixed(2);
            }
        }
    },
    render : function () {
        "use strict";
        this.isNumeric = this.props.isNumeric;
        this.setFixedFloatingZeros = this.props.setFixedFloatingZeros;
        this.keyUpEvent = this.props.keyUp;
        var identifier = easyGid.new();
        return (
           <div className={this.state.formClassCollection}>
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <label className="floating-label" htmlFor={identifier}>{this.props.label}</label>
                  <input ref="textBox" className="form-control" id={identifier} value={this.props.value} type="text" onKeyUp={this.keyUpEventBase} onBlur={this.blurEventBase} onChange={this.valueChange}/>
                </div>
              </div>
           </div>
        );
    }
});

module.exports = TextField;