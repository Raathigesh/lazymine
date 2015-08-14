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
                    <div className="col-md-11 col-xs-11 date-picker-help">
                        Pick a date here: 
                        <DatePicker ref="datePicker" />
                    </div>
                     <div className="col-md-1 col-xs-1 menu-container">
                        <Menu />
                     </div>
                </div>
            </div>
        );
    }
});

module.exports = InfoBar;