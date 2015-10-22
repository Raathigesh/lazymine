/*global require, module*/
/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');

var UpdateNotifier = React.createClass({
	version: null,
	getInitialState: function(){
		return {
			message: null,
			isInstalling: false
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
			this.setState({
				message: null,
				isInstalling: true
			});
			installUpdate();
	},

	updateInstalled: function() {
		this.setState({
			message: null,
			isInstalling: false
		});
		AppActions.updateInstalled();
	},

  render: function () {
        "use strict";
				var content = null;

				if(this.state.isInstalling && this.props.installed === false) {
					content = <div className='UpdaterNotifier'>Update {this.props.version} is installing. Please wait!</div>;

				} else  if(this.props.version !== null) {
					 content = <div className='UpdaterNotifier'>Update {this.props.version} is available. <a href='#' onClick={this.installUpdate}>Install Now</a></div>;
				}

				if(this.props.version === null && this.props.installed) {
					content = <div className='UpdaterNotifier'>Update {this.props.version} installed successfully. Please restart Lazymine.</div>;
				}

        return (content);
    }
});

module.exports = UpdateNotifier;
