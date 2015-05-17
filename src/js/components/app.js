/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');
var Container = require('../components/app-Container');
var SearchBox = require('../components/app-SearchBox');
var TaskList = require('../components/app-TaskList');
var Login = require('../components/app-Login');
var NavBar = require('../components/app-NavBar');


var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var App = React.createClass({
    render: function () {
        return (<div>
                	<RouteHandler/>
                </div>);
    }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="home" handler={Container}/>
    <Route name="login" handler={Login}/>
    <DefaultRoute handler={Container}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('lazymine-App'));
});

module.exports = App;
