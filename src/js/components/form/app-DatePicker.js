/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var DatePicker = React.createClass({
    getValue: function(){
        return React.findDOMNode(this.refs.date).value;
    },

    timeTodayDateElse: function(date) {
        moment.lang('en', {
            'calendar': {
                'lastDay': '[Yesterday] Do MMMM',
                'sameDay': '[Today] Do MMMM',
                'nextDay': '[Tomorrow] Do MMMM',
                'lastWeek': 'Do MMMM',
                'nextWeek': 'Do MMMM',
                'sameElse': 'Do MMMM'
            }
        });

        return moment(date).calendar();
    },

    render : function(){
        return (
            <div>
                <input ref="date" value={"28/2/2015"} className="datepicker-adv datepicker-adv-default form-control picker__input" id="datepicker-adv-1" type="text" readonly="" aria-haspopup="true" aria-expanded="false" aria-readonly="false" aria-owns="datepicker-adv-1_root"/>
            </div>

        );
    }
});

module.exports = DatePicker;