/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-base-store');
var AppActions = require('../actions/app-actions');
var TaskAssinee = require('../constants/task-assignee');
var Title = require('../components/app-Title');
var Header = require('../components/app-Header');
var Router = require('react-router');

var Settings = React.createClass({

	contextTypes: {
    	router: React.PropTypes.func
  	},

	render : function(){ 
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
										<div className="form-group form-group-label">
											<div className="row">
												<div className="col-md-10 col-md-push-1">
													<label className="floating-label" for="login-username">Redmine URL</label>
													<input className="form-control" id="login-username" type="text"></input>
												</div>
											</div>
										</div>
										<div className="form-group form-group-label">
											<div className="row">
												<div className="col-md-10 col-md-push-1">
													<label className="floating-label" for="login-password">API Key</label>
													<input className="form-control" id="login-password" type="password"></input>
												</div>
											</div>
										</div>
										<div className="form-group">
											<div className="row">
												<div className="col-md-10 col-md-push-1">
													<button className="btn btn-block btn-blue waves-button waves-effect waves-light">Connect</button>
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
