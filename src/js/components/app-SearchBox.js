/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var SearchResult = require('../components/app-SearchResult');

var SearchBox = React.createClass({

    ActiveItem : 0,

    // Filters items as user types
    filter: function (event) {
        var q = event.target.value;
        AppActions.search(q);
        this.toggleResultsPanel(true);
    },    

    // Initial states with no items
    getInitialState: function () {
        return {
          "showResults" : true
        };
    },

    toggleResultsPanel: function(show){      
        this.setState({
          "showResults" : show
        });
    },

    navigate: function (event) {      
        this.refs.searchResult.navigate(event);
    },
    
    render: function() {
      return (
        <div className="col-md-12">
            <input id="search" ref="searchBox" type="text" className="search-control" onChange={this.filter} onKeyDown={this.navigate} placeholder="Type a name, id, #latest, #mine, #lastupdated..."/>
            
            { 
              this.state.showResults 
              ? <SearchResult ref="searchResult" results={this.props.items} toggleResultsPanel={this.toggleResultsPanel}/> 
              : null 
            }
        </div>
      );
    }
});

module.exports = SearchBox;
