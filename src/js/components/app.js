/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js'); 
var SearchBox = require('../components/app-SearchBox.js');

var App = React.createClass({
    render: function () {
        return (<div>
                    <h1>Search</h1>
                    <SearchBox/>
               </div>) 
    }
});

module.exports = App;