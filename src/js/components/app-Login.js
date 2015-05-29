/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    Title = require('../components/app-Title'),
    Header = require('../components/app-Header'),
    Router = require('react-router'),
	TextField = require('../components/form/app-TextField');

var Settings = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

	getInitialState: function () {
		return AppStore.getState();
	},

	componentWillMount: function () {
		AppStore.addChangeListener(this._change);
	},

	_login: function () {
		var url = this.refs.url.getValue();
		var apiKey = this.refs.apiKey.getValue();

		AppActions.saveSettings(url, apiKey);
	},

	_change: function () {
		var storeState = AppStore.getState();
		this.setState(storeState);

		if(this.state.settings.BaseURL !== null && this.state.settings.BaseURL !== ""
			&& this.state.settings.APIKey !== null && this.state.settings.APIKey !== ""){
			this.context.router.transitionTo('home');
		}
	},

    render : function () {
        "use strict";
        return (
            <div>
                <Header />
				<div className="col-lg-4 col-lg-push-4 col-sm-6 col-sm-push-3">
					<div className="card-wrap login-card-wrap">
						<div className="card">
							<div className="card-main">
								<div className="card-inner">
									<p className="text-center login-avatar-wrapper">
										<span className="avatar avatar-inline avatar-lg">
											<img alt="Login" src="assets/logo.jpg"></img>
										</span>
									</p>
									<form className="form" action="index.html">
										<TextField ref="url" label = "Redmine URL" />
										<TextField ref="apiKey" label = "API Key" />
										<div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-push-1">
													<a className="btn btn-block btn-lazy waves-button waves-effect waves-light" onClick={this._login}>Connect</a>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Settings;
