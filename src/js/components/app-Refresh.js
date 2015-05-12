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
        <div className="fbtn-container top-refresh">
            <div className="fbtn-inner" onClick={this._refreshTasks}>
                <a className="fbtn fbtn-green fbtn-lg">
                    <span className="fbtn-text">Refresh Items</span>
                    <span className="fbtn-ori icon icon-refresh"></span>
                </a>
            </div>
        </div>
        );
    }
});

module.exports = Refresh;