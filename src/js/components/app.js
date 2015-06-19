/*global require, module*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    Container = require('../components/app-Container'),
    Login = require('../components/app-Login'),
    AppRoutes = require('../constants/app-routes'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    NotFoundRoute = Router.NotFoundRoute,
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
  <Route name={AppRoutes.Home} path="/" handler={App}>
    <Route name={AppRoutes.Login} handler={Login} />
    <DefaultRoute handler={Container} />
    <NotFoundRoute handler={Container} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('lazymine-App'));
});

module.exports = App;
