/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var TextField = Mui.TextField;
var Footer = require('../components/app-Footer');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var Router = require('react-router');

var Settings = React.createClass({
	contextTypes: {
    	router: React.PropTypes.func
  	},
	saveSettings: function(){		 		
		var url = this.refs.url.getValue();  
		var apiKey = this.refs.apiKey.getValue();
		AppActions.saveSettings(url, apiKey); 
		this.context.router.transitionTo('home');
	},

	getInitialState: function () {		
       return AppStore.getSettings();       
  	}, 

	render : function(){ 
		return ( 
			<div>
				<div className="container-fluid">
				  <div className="row">
				   	<div className="col-md-12">
				   		<TextField ref="url" hintText="Redmine Url" className="comment-box" defaultValue={this.state.BaseURL}/>
				   	</div>
				  </div>
				  <div className="row">
				   	<div className="col-md-12">
				   		<TextField ref="apiKey" hintText="Api Key" className="comment-box" defaultValue={this.state.APIKey}/>
				   	</div>
				  </div>
				</div>
				<Footer primaryText="SAVE" primaryClick={this.saveSettings} secondaryText="CANCEL" cancelLink="#"/>
			</div>
		);
	}
});

module.exports = Settings;
