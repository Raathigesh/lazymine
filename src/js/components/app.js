/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    Container = require('../components/app-Container'),
    Login = require('../components/app-Login'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
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
