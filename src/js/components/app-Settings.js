/** @jsx React.DOM */
var React = require('react');
var Mui = require('material-ui');
var TextField = Mui.TextField;
var RadioButtonGroup = Mui.RadioButtonGroup;
var RadioButton = Mui.RadioButton;
var Footer = require('../components/app-Footer');
var AppStore = require('../stores/app-store-base');
var AppActions = require('../actions/app-actions');
var TaskAssinee = require('../constants/task-assignee');
var Title = require('../components/app-Title');
var Router = require('react-router');

var Settings = React.createClass({

	contextTypes: {
    	router: React.PropTypes.func
  	},

	getInitialState: function () {		
       return AppStore.getState();       
  	},

  	_saveSettings: function(){
		var url = this.refs.url.getValue();  
		var apiKey = this.refs.apiKey.getValue();
		var assignee = this.refs.assignee.getSelectedValue();
		AppActions.saveSettings(url, apiKey, assignee); 
		this.context.router.transitionTo('home');
	}, 

	render : function(){ 
		return ( 
			<div>
				<div className="container-fluid">
					<Title text="Basic Settings"/>	
				  <div className="row">
				   	<div className="col-md-12">
				   		<TextField 
				   			ref="url" 
				   			hintText="Redmine Url" 
				   			className="comment-box" 
				   			defaultValue={this.state.settings.BaseURL}/>
				   	</div>
				  </div>				 
				  <div className="row">
				   	<div className="col-md-12">
				   		<TextField 
				   			ref="apiKey" 
				   			hintText="Api Key" 
				   			className="comment-box" 
				   			defaultValue={this.state.settings.APIKey}/>
				   	</div>
				  </div>
				   <Title text="Data Fetching Preference"/>	
				   <div className="row">
				   	<div className="col-md-12">
				   		<RadioButtonGroup 
				   			name="assigneeType"
				   			ref="assignee"
					  		defaultSelected="*">
							    <RadioButton
							      value="*"
							      label="All"
							      defaultChecked={true} />
							    <RadioButton
							      value="me"
							      label="Assigned To Me"/>
						</RadioButtonGroup>
			   		</div>
				  </div>				  
				</div>
				<Footer 
					primaryText="SAVE" 
					primaryClick={this._saveSettings} 
					secondaryText="CANCEL" 
					cancelLink="#"/>
			</div>
		);
	}
});

module.exports = Settings;
