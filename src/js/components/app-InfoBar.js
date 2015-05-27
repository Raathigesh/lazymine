/** @jsx React.DOM */
var React = require('react');
var Datepicker = require('../components/form/app-DatePicker');
var Moment = require('moment');

var InfoBar = React.createClass({
    getSelectedDate: function(){
        return this.refs.datePicker.getValue();
    },

    render: function () {
        var today = Moment().format('D/M/YYYY');
        return (
            <div className="datePicker">
                <Datepicker ref="datePicker" initialDate={today}/>
            </div>
        );
    }
});

module.exports = InfoBar;