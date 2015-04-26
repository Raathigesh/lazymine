/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');
var Header = require('../components/app-Header');
var Container = require('../components/app-Container');
var SearchBox = require('../components/app-SearchBox');
var TaskList = require('../components/app-TaskList');
var Settings = require('../components/app-Settings');


var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var App = React.createClass({
    render: function () {
        return (<div>        			
                  	<Header/>
                  	<RouteHandler/>
                </div>);
    }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="home" handler={Container}/>
    <Route name="setting" handler={Settings}/>
    <DefaultRoute handler={Container}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('lazymine-App'));
});

module.exports = App;
