/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    moment = require('moment');

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
    componentWillReceiveProps: function () {
        "use strict";
        // Since the input does not fire a proper change event, we have to set the state before rendering.
        if (React.findDOMNode(this.refs.date)) {
            if (this.isMounted()) {
                this.setState({
                    selectedDate: React.findDOMNode(this.refs.date).value
                });
            }
        }
    },
    componentDidMount: function () {
        $('.datepicker-adv-default').each(function(index) {
            var datepickerAdv = $(this).pickadate({container: 'body'}),
                datepickerApi = datepickerAdv.pickadate('picker');

            datepickerApi.on({
                close: function() {
                    $(document.activeElement).blur();
                },
                open: function() {
                    datepickerApi.set('select', datepickerApi.get(), {format: 'ddd, dd mmm yyyy'});
                }
            });
        });
    },
    render : function () {
        "use strict";
        return (
            <div className="date-picker-container" title="Click to select date to enter time for">
                <input ref="date" value={this.state.selectedDate} className="datepicker-adv datepicker-adv-default form-control" id="datepicker-adv-1" type="text" />
            </div>

        );
    }
});

module.exports = DatePicker;