var React = require('react'),
WeeklyViewDayHeader = require('../components/app-WeeklyViewDayHeader'),
WeeklyViewDay = require('../components/app-WeeklyViewDay'),
StateMixin = require('../mixins/app-StateMixin');

var WeekTimeCard = React.createClass({
    mixins: [StateMixin],
    
    render: function () {

        var weeklyVewContent =  null;
        var totalHoursForWeek = 0;

        if(this.props.data !== null) {            

             weeklyVewContent = this.props.data.map(function(item, i) {
                
                var totalHoursForDay = 0;

                var tasksForDayContent = item.data.map(function(timeEntry, a) {
                    totalHoursForDay = totalHoursForDay + timeEntry.hours;
                    return <WeeklyViewDay iconText="R" hours={timeEntry.hours} taskName={timeEntry.id} />                       
                }.bind(this));

                totalHoursForWeek = totalHoursForWeek + totalHoursForDay;
                return <div><WeeklyViewDayHeader day={item.day.format("MMM Do YY")} totalHours={totalHoursForDay} /> {tasksForDayContent} </div>
            }.bind(this));
        }       

        "use strict";
        return (
            <div className="card card-blue">
                <div className="card-main">
                    <div className="card-header">
                        <div className="card-inner">
                            <p className="card-heading">Weekly Summary</p>
                            <a className="pull-right collapsed week-time-expand" data-toggle="collapse" href="#collapsible-region">
                                <span className="icon icon-expand-more collapsed-show"></span>
                                <span className="icon icon-expand-less collapsed-hide"></span>
                            </a>
                        </div>
                    </div>
                    <div className="card-img">
                        <span className="card-key-value">{totalHoursForWeek}</span> <span className="card-sub-heading">Hours entered for the week August 2 - August 8</span>
                    </div>
                    <div className="card-inner collapsible-region collapse" id="collapsible-region" aria-expanded="false" style={{height: 0 + 'px'}}>
                       {weeklyVewContent}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WeekTimeCard;