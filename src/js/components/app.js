/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js'); 
var SearchBox = require('../components/app-SearchBox.js');
var TaskList = require('../components/app-TaskList.js');


var App = React.createClass({
    render: function () {
        return (<div><SearchBox/>
                <TaskList/></div>); 
    }
});

module.exports = App;
