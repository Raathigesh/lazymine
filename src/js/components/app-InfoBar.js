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
        return (
            <div className="datePicker">
                <DatePicker ref="datePicker" />
            </div>
        );
    }
});

module.exports = InfoBar;