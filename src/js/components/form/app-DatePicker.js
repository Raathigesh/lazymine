/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    moment = require('moment'),
    Router = require('react-router'),
    Link = Router.Link;

var DatePicker = React.createClass({
    getInitialState: function () {
        "use strict";
        return {
            selectedDate: moment().format('ddd, DD MMM YYYY')
        };
    },
    getValue: function () {
        "use strict";
        return moment(this.state.selectedDate, 'ddd, DD MMM YYYY');
    },
    render : function () {
        "use strict";
        if(React.findDOMNode(this.refs.date)) {
            this.setState({
                open: React.findDOMNode(this.refs.date).value
            });
        }

        return (
            <div className="date-picker-container">
                <input ref="date" value={this.state.selectedDate} className="datepicker-adv datepicker-adv-default form-control" id="datepicker-adv-1" type="text" />
            </div>

        );
    }
});

module.exports = DatePicker;