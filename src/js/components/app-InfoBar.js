/** @jsx React.DOM */
var React = require('react');
var Datepicker = require('../components/form/app-DatePicker');
var Moment = require('moment');

var InfoBar = React.createClass({
    render: function () {
        var today = Moment().format('L');
        return (
            <div className="row">
                <div className="col-md-6 datePicker">
                    <Datepicker initialDate={today}/>
                </div>
            </div>
        );
    }
});

module.exports = InfoBar;