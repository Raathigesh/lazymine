var React = require('react'),
    StateMixin = require('../mixins/app-StateMixin'),
    SearchBox = require('../components/app-SearchBox'),
    Footer = require('../components/app-Footer'),
    AppActions = require('../actions/app-actions'),
    TaskList = require('../components/app-TaskList');

var MainCard = React.createClass({
    mixins: [StateMixin],
        _updateTime: function () {
        "use strict";
        var dateSelected = this.refs.infoBar.getSelectedDate();
        AppActions.createTimeEntries(dateSelected);
    },
    _cancel: function () {
        "use strict";
        AppActions.clearTimeEntries();
    },
    render: function () {
        "use strict";
        return (
            <div className="card">
                <div className="card-main">
                    <div className="card-inner">
                        <p className="card-heading">Pick Your Tasks</p>
                        <SearchBox items={this.state.filteredResult}/>
                        <div>
                            <TaskList items={this.state.activeItems} activities={this.state.activities} customFields={this.state.settings.customFields}/>
                        </div>
                    </div>
                    <div className="card-action">         
                        <Footer
                        primaryText="UPDATE"
                        primaryClick={this._updateTime}
                        secondaryText="CLEAR"
                        secondaryClick={this._cancel}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MainCard;
