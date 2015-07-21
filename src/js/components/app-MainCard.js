var React = require('react'),
    StateMixin = require('../mixins/app-StateMixin'),
    SearchBox = require('../components/app-SearchBox'),
    TaskList = require('../components/app-TaskList');

var MainCard = React.createClass({
    mixins: [StateMixin],
    render: function () {
        "use strict";
        return (
            <div className="card">
                <div className="card-main">
                    <div className="card-header">
                        <div className="card-inner-side pull-left">
                            <div className="card-inner">
                                <span>Pick Your Tasks</span>
                            </div>
                        </div>
                    </div>
                    <SearchBox items={this.state.filteredResult}/>
                    <div className="card-inner">
                        <TaskList items={this.state.activeItems} activities={this.state.activities} customFields={this.state.settings.customFields}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MainCard;
