/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions');
var Header = require('../components/app-Header');
var Container = require('../components/app-Container');
var SearchBox = require('../components/app-SearchBox');
var TaskList = require('../components/app-TaskList');

var App = React.createClass({
    render: function () {
        return (<div>
                  <Header/>
                  <Container/>
                </div>);
    }
});

module.exports = App;
