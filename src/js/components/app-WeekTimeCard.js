var React = require('react'),
StateMixin = require('../mixins/app-StateMixin');

var WeekTimeCard = React.createClass({
    mixins: [StateMixin],
    
    render: function () {
        "use strict";
        return (
            <div className="card card-blue">
                <div className="card-main">
                    <div className="card-header weekly-summary-header collapsed week-time-expand" data-toggle="collapse" href="#collapsible-region">
                        <div className="card-inner">
                            <p className="card-heading">Weekly Summary</p>
                                <span className="pull-right icon icon-expand-more collapsed-show"></span>
                                <span className="pull-right icon icon-expand-less collapsed-hide"></span>
                        </div>
                    </div>
                    <div className="card-img">
                        <span className="card-key-value">38</span> <span className="card-sub-heading">Hours entered for the week August 2 - August 8</span>
                    </div>
                    <div className="card-inner collapsible-region collapse" id="collapsible-region" aria-expanded="false" style={{height: 0 + 'px'}}>
                        <div className="daily-time-total">
                            <span className="text-left">
                                Sunday August 2
                            </span>
                            <span className="pull-right">
                                7.5h
                            </span>
                        </div>
                        <div className="tile tile-collapse">
                            <div className="card-action">
                                <div className="pull-left tile-side">
                                    <div className="avatar avatar-sm avatar-multi">
                                        <span className="">R</span> 
                                    </div>
                                </div>
                                <div className="tile-action tile-action-show">
                                    1.5h
                                </div>
                                <div class="tile-inner">
    <div class="text-overflow">
        OAC-254 OAC Tiger Beta Release : Submit and c
    </div>
</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WeekTimeCard;