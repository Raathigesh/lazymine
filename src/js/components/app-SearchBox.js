/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var SearchResult = require('../components/app-SearchResult');

var SearchBox = React.createClass({

    ActiveItem : 0,
    
    getInitialState: function () {
        return {
          "showResults" : true
        };
    },

    _toggleResultsPanel: function(show){      
        this.setState({
          "showResults" : show
        });
    },

    _filter: function (event) {
        var q = event.target.value;
        AppActions.search(q);
        this._toggleResultsPanel(true);
    },    

    _navigate: function (event) {      
        this.refs.searchResult._navigate(event);
    },
    
    render: function() {
      return (
        <div className="col-md-12">
            <input id="search" ref="searchBox" type="text" className="search-control" onChange={this._filter} onKeyDown={this._navigate} placeholder="Type a name, id, #latest, #mine, #lastupdated..."/>            
            { 
              this.state.showResults 
              ? <SearchResult ref="searchResult" results={this.props.items} toggleResultsPanel={this._toggleResultsPanel}/> 
              : null 
            }
        </div>
      );
    }
});

module.exports = SearchBox;