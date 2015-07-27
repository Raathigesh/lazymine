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
            <div className="">
                <div className="row datePicker">
                    <div className="col-md-7 col-xs-8 text-right date-picker-help">
                        You are viewing time information for: 
                    </div>
                    <div className="col-md-4 col-xs-4 date-picker-container">
                        <DatePicker ref="datePicker" />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = InfoBar;