/*global require, module*/
/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');

var UpdateNotifier = React.createClass({
	version: null,
	getInitialState: function(){
		return {
			message: null
		};
	},

  componentDidMount: function () {
		var that = this;
		setTimeout(function(){
			checkForUpdate(that.updateAvailable, that.updateInstalled);
		}, 3000);
	},

	updateAvailable: function(version) {
		AppActions.updateAvilable(version);
	},

	installUpdate: function(){
			installUpdate();
	},

	updateInstalled: function() {
		AppActions.updateInstalled();
	},

  render: function () {
        "use strict";
				var content = null;

				if(this.props.version !== null) {
					 content = <div>Update {this.props.version} is available. <a href='#' onClick={this.installUpdate}>Install Now</a></div>;
				}

				if(this.props.version === null && this.props.installed) {
					content = <div>Update {this.props.version} installed successfully. Please restart Lazymine.</div>;
				}

        return (content);
    }
});

module.exports = UpdateNotifier;
