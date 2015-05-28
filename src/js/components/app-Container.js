/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-base-store');
var AppActions = require('../actions/app-actions');
var Header = require('../components/app-Header');
var Title = require('../components/app-Title');
var TaskList = require('../components/app-TaskList');
var Footer = require('../components/app-Footer');
var Loader = require('../components/app-Loader');
var Errors = require('../constants/store-errors');
var Toast = require('../components/app-Toast');

var Container = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function () {
        return AppStore.getState();
    },

    componentWillMount: function () {
        AppStore.addChangeListener(this._change);
        AppActions.fetchIssues();
    },

    componentDidMount: function () {
        if (this.state.settings.BaseURL == null || this.state.settings.BaseURL == "" || this.state.settings.APIKey == null || this.state.settings.APIKey == "") {
            this.context.router.transitionTo('login');
        }
    },

    _change: function () {
        var storeState = AppStore.getState();
        this.setState(storeState);
    },

    _updateTime: function () {
        var dateSelected = this.refs.header.getSelectedDate();
        AppActions.createTimeEntries(dateSelected);
    },

    _cancel: function () {
        AppActions.clearTimeEntries();
    },

    render: function () {
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