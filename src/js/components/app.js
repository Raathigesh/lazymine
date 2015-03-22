/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js'); 
var SearchBox = require('../components/app-SearchBox.js');

var App = React.createClass({
    render: function () {
        return (<SearchBox/>);
    }
});

module.exports = App;
