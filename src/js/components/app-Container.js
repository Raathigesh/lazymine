/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    Header = require('../components/app-Header'),
    Footer = require('../components/app-Footer'),
    Loader = require('../components/app-Loader'),
    Toast = require('../components/app-Toast'),
    About = require('../components/app-About'),
    InfoBar = require('../components/app-InfoBar'),
    MainCard = require('../components/app-MainCard'),
    AuthMixin = require('../mixins/app-AuthMixin'),
    StateMixin = require('../mixins/app-StateMixin');

var Container = React.createClass({
    mixins: [AuthMixin, StateMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    componentWillMount: function () {
        "use strict";
        AppActions.fetchIssues();
    },
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
            <div>
                <Header ref="header" />
                <Loader isLoading={this.state.isLoading}/>
                <Toast error={this.state.error}/>
                <div className="container">
                    <div className="container-inner">
                        <InfoBar ref="infoBar"/>
                        <MainCard />
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