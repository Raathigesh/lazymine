/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Menu = require('../components/app-Menu'),
    DatePicker = require('../components/form/app-DatePicker');

var InfoBar = React.createClass({
    getSelectedDate: function () {
        "use strict";
        return this.refs.datePicker.getValue();
    },

    render: function () {
        "use strict";
        return (
            <div className="row datePicker">
                <div className="pull-left">
                    <DatePicker ref="datePicker" />
                </div>
                <Menu />
            </div>
        );
    }
});

module.exports = InfoBar;