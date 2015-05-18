/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var SearchBox = require('../components/app-SearchBox');
var AppStore = require('../stores/app-base-store');
var AppActions = require('../actions/app-actions');
var Link = Router.Link;

var Header = React.createClass({
    getInitialState: function () {
        return AppStore.getState();
    },

    componentWillMount: function () {
        AppStore.addChangeListener(this._change);
    },

    _change: function () {
        var storeState = AppStore.getState();
        this.setState(storeState);
    },

    _close: function () {
        MinimizeWindow();
    },

    render : function(){
        return (
            <header className="header navbar navbar-default">
                <div className="header-row">
        	        <a className="navbar-brand" href="#">
            	        <img src="assets/top-logo.png" />
                    </a>
                    <a className="close-btn pull-right" href="#" onClick={this._close}>
                        <span className="access-hide">Close</span>
                        <span className="icon icon-close icon-lg"></span>
                    </a>
                </div>
                { this.props.search == "show" ? <SearchBox items={this.state.filteredResult}/> : null }
            </header>
        );
    }
});

module.exports = Header;