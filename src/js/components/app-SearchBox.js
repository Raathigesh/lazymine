/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');

var SearchBox = React.createClass({
    performSearch: function(event){
        AppActions.search(event.target.value);
    },
    render: function(){          
    return (
        <div class="input-group">
            <input type="text" class="form-control" placeholder="Search" name="q" onChange={this.performSearch}/>
        </div>);
    }
});

module.exports = SearchBox;
