/** @jsx React.DOM */
var React = require('react');
var Moment = require('moment');
var Router = require('react-router');
var Link = Router.Link;


var DatePicker = React.createClass({
    getValue: function(){
        return Moment(React.findDOMNode(this.refs.date).value, "DD-MM-YYYY");
    },

    render : function(){
        return (
            <div>
                <input ref="date" value={this.props.initialDate} className="datepicker-adv datepicker-adv-default form-control picker__input" id="datepicker-adv-1" type="text" readonly="" aria-haspopup="true" aria-expanded="false" aria-readonly="false" aria-owns="datepicker-adv-1_root"/>
            </div>

        );
    }
});

module.exports = DatePicker;