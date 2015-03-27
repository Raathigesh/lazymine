/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions'); 
var SearchBox = require('../components/app-SearchBox');
var TaskList = require('../components/app-TaskList');


var App = React.createClass({
    render: function () {
        return (<div><SearchBox/>
                <TaskList/></div>); 
    }
});

module.exports = App;
