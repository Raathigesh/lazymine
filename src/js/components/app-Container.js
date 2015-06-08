/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    Header = require('../components/app-Header'),
    TaskList = require('../components/app-TaskList'),
    Footer = require('../components/app-Footer'),
    Loader = require('../components/app-Loader'),
    Toast = require('../components/app-Toast'),
    About = require('../components/app-About'),
    KeyMaster = require('keymaster');

var Container = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        "use strict";
        return AppStore.getState();
    },
    componentWillMount: function () {
        "use strict";
        AppStore.addChangeListener(this._change);
        AppActions.fetchIssues();
    },
    componentDidMount: function () {
        "use strict";
        if (this.state.settings.BaseURL === null || this.state.settings.BaseURL === "" || this.state.settings.APIKey === null || this.state.settings.APIKey === "") {
            this.context.router.transitionTo('login');
        }

        KeyMaster('ctrl+shift+s', this._updateTime);
        KeyMaster('ctrl+shift+d', this._cancel);
    },
    componentWillUnmount: function() {
        KeyMaster.unbind('ctrl+shift+s', this._updateTime);
        KeyMaster.unbind('ctrl+shift+d', this._cancel);
    },
    _change: function () {        
        "use strict";
        var storeState = AppStore.getState();
        this.setState(storeState);

        if (this.state.settings.BaseURL === null || this.state.settings.BaseURL === "" || this.state.settings.APIKey === null || this.state.settings.APIKey === "") {
            this.context.router.transitionTo('login');
        }
    },
    _updateTime: function () {
        "use strict";
        var dateSelected = this.refs.header.getSelectedDate();
        AppActions.createTimeEntries(dateSelected);
    },

    _cancel: function () {
        "use strict";
        AppActions.clearTimeEntries();
    },

    render: function () {
        "use strict";
        return (
            <div>
                <Header search="show" ref="header" />
                <Loader isLoading={this.state.isLoading}/>
                <Toast error={this.state.error}/>
                <div className="container">
                    <div className="container-inner">
                        <TaskList items={this.state.activeItems} activities={this.state.activities}/>
                    </div>
                </div>
                <About />
                <Footer
                    primaryText="UPDATE"
                    primaryClick={this._updateTime}
                    secondaryText="CLEAR"
                    secondaryClick={this._cancel}/>
            </div>
        );
    }
});

module.exports = Container;