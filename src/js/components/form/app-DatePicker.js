/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var DatePicker = React.createClass({
    getValue: function(){
        return React.findDOMNode(this.refs.date).value;
    },
    render : function(){
        return (
            <input ref="date" className="datepicker-adv datepicker-adv-default form-control picker__input" id="datepicker-adv-1" type="text" readonly="" aria-haspopup="true" aria-expanded="false" aria-readonly="false" aria-owns="datepicker-adv-1_root"/>
        );
    }
});

module.exports = DatePicker;