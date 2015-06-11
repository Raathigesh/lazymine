/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    Container = require('../components/app-Container'),
    Login = require('../components/app-Login'),
    AppRoutes = require('../constants/app-routes'),
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
  <Route name={AppRoutes.App} path="/" handler={App}>
    <Route name={AppRoutes.Home} handler={Container}/>
    <DefaultRoute handler={Login}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('lazymine-App'));
});

module.exports = App;
