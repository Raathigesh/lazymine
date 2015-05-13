/** @jsx React.DOM */
var React = require('react'),
    Validator = require('validator');

var TextField = React.createClass({
    formNormalClasses: "form-group form-group-label",
    formNormalClassesFocus: "form-group form-group-label control-focus",
    formErrorClassesFocus: "form-group form-group-label form-group-red control-focus",
    isNumeric: false,
    keyUpEvent: null,
    getValue: function(){
      return React.findDOMNode(this.refs.textBox).value;
    },
    getInitialState: function () {
        return {
            "formClassCollection": this.formNormalClasses
        };
    },
    keyUpEventBase: function (event) {
        if(this.isNumeric) {
            var value = this.getValue();
            if (value === "" || Validator.isInt(value) || Validator.isFloat(value)) {
                this.setState({
                    "formClassCollection": this.formNormalClassesFocus
                });
            } else {
                this.setState({
                    "formClassCollection": this.formErrorClassesFocus
                });
            }
        }

        if (this.keyUpEvent) {
            this.keyUpEvent(event);
        }
    },
    render : function(){
        this.isNumeric = this.props.isNumeric,
        this.keyUpEvent = this.props.keyUp;
        return (
           <div className={this.state.formClassCollection}>
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <label className="floating-label" for="float-text">{this.props.label}</label>
                  <input ref="textBox" className="form-control" id="float-text" type="text" onKeyUp={this.keyUpEventBase}/>
                </div>
              </div>
           </div>
        );
    }
});

module.exports = TextField;