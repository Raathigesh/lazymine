/** @jsx React.DOM */
var React = require('react');
var Datepicker = require('../components/form/app-DatePicker');

var InfoBar = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-4">
                    <span> You are updating time for</span> <Datepicker />
                </div>
                <div className="col-md-6">
                    Total Hours : 8.00
                </div>
            </div>
        );
    }
});

module.exports = InfoBar;