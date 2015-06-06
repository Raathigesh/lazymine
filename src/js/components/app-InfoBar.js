/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    DatePicker = require('../components/form/app-DatePicker'),
    moment = require('moment');

var InfoBar = React.createClass({
    getSelectedDate: function () {
        "use strict";
        return this.refs.datePicker.getValue();
    },

    render: function () {
        "use strict";
        var today = moment().format('ddd, DD MMM YYYY');
        return (
            <div className="datePicker">
                <DatePicker ref="datePicker" initialDate={today}/>
            </div>
        );
    }
});

module.exports = InfoBar;