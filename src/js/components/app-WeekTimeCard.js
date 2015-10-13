var React = require('react'),
WeeklyViewDayHeader = require('../components/app-WeeklyViewDayHeader'),
WeeklyViewDay = require('../components/app-WeeklyViewDay'),
StateMixin = require('../mixins/app-StateMixin');

var WeekTimeCard = React.createClass({
    mixins: [StateMixin],
    _getIconText: function(projectName){
        // get the first word character of, first two words"
        var iconText = '';
        var words = projectName.split(" ");
        if(words.length >=2){
            var firstChar = words[0].replace(/\W/g, '').charAt(0);
            var secondChar = words[1].replace(/\W/g, '').charAt(0);
            iconText = firstChar + secondChar
        }
        else if(words.length == 1){
            iconText = words[0].replace(/\W/g, '');
            iconText = iconText.length>2?iconText.substring(0,2):iconText;
        }
        return iconText.toUpperCase();
    },
    render: function () {

        var weeklyVewContent = null,
            totalHoursForWeek = 0,
            firstDate = null,
            lastDate = null;

        if (this.props.data !== null) {
            firstDate = this.props.data[0].day.format('MMMM Do');
            lastDate = this.props.data[this.props.data.length - 1].day.format('MMMM Do');

            weeklyVewContent = this.props.data.map(function (item, i) {
                var totalHoursForDay = 0,
                    tasksForDayContent = item.data.map(function (timeEntry, a) {
                        totalHoursForDay = totalHoursForDay + timeEntry.hours;
                        return <WeeklyViewDay timeEntryUrl={timeEntry.timeEntryUrl} iconText={this._getIconText(timeEntry.project)} projectName={timeEntry.project} hours={timeEntry.hours} taskName={timeEntry.subject}/>
                    }.bind(this));

                totalHoursForWeek = totalHoursForWeek + totalHoursForDay;
                return <div><WeeklyViewDayHeader day={item.day.format('ddd, DD MMM YYYY')}
                                                 totalHours={totalHoursForDay}/> {tasksForDayContent} </div>
            }.bind(this));
        }

        "use strict";
        return (
            <div className="card card-blue">
                <div className="card-main">
                    <div className="card-header weekly-summary-header collapsed week-time-expand" data-toggle="collapse"
                         href="#collapsible-region">
                        <div className="card-inner">
                            <p className="card-heading">Weekly Summary</p>
                            <span className="pull-right icon icon-expand-more collapsed-show"></span>
                            <span className="pull-right icon icon-expand-less collapsed-hide"></span>
                        </div>
                    </div>
                    <div className="card-img">
                        <span className="card-key-value">{totalHoursForWeek}</span>
                        <span className="card-sub-heading">Hours entered for the week {firstDate} - {lastDate}</span>
                    </div>
                    <div className="card-inner collapsible-region collapse" id="collapsible-region"
                         aria-expanded="false" style={{height: 0 + 'px'}}>
                        {weeklyVewContent}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WeekTimeCard;