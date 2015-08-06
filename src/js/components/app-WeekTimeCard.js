var React = require('react'),
StateMixin = require('../mixins/app-StateMixin');

var WeekTimeCard = React.createClass({
    mixins: [StateMixin],
    
    render: function () {
        "use strict";
        return (
            <div className="card">
                <div className="card-main">
                    <div className="card-inner">
                        <p className="card-heading">Weekly Summary</p>
                    </div>
                    <div className="card-action"> 
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WeekTimeCard;