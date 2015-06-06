/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
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
var getDefaultRoute = function () {
    return AppStore.getState().settings.available ? Container : Login;
};
var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="home" handler={Container}/>
    <Route name="login" handler={Login}/>
    <DefaultRoute handler={getDefaultRoute()}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('lazymine-App'));
});

module.exports = App;
