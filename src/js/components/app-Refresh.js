/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var AppActions = require('../actions/app-actions');
var Link = Router.Link;

var Refresh = React.createClass({

    _refreshTasks: function() {
        AppActions.refreshIssues();
    },

    render : function(){
        return (
            <div className="btn btn-success btn-fab btn-raised mdi-notification-sync top-refresh" onClick={this._refreshTasks}></div>
        );
    }
});

module.exports = Refresh;