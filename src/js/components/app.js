/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppActions = require('../actions/app-actions'),
    Container = require('../components/app-Container'),
    SearchBox = require('../components/app-SearchBox'),
    TaskList = require('../components/app-TaskList'),
    Login = require('../components/app-Login'),
    NavBar = require('../components/app-NavBar'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler;

var App = React.createClass({
    render: function () {
        "use strict";
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
