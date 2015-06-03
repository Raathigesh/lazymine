/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    moment = require('moment'),
    Router = require('react-router'),
    Link = Router.Link;


var DatePicker = React.createClass({
    getValue: function () {
        "use strict";
        return moment(React.findDOMNode(this.refs.date).value, "DD-MM-YYYY");
    },

    render : function () {
        "use strict";
        return (
            <div className="date-picker-container">
                <input ref="date" value={this.props.initialDate} className="datepicker-adv datepicker-adv-default form-control" id="datepicker-adv-1" type="text" />
            </div>

        );
    }
});

module.exports = DatePicker;