var React = require('react');
var SearchResultItem = require('../components/app-SearchItem');
var AppActions = require('../actions/app-actions');

var SearchResult = React.createClass({

	ActiveItem : 0,

    getCurrentActiveResult: function(){
        return this.refs["searchItem" + this.ActiveItem];
    },

    getNextResult: function(){
        this.ActiveItem += 1;
        return this.refs["searchItem" + this.ActiveItem];
    },

    getPreviousResult: function(){
        this.ActiveItem -= 1;
        return this.refs["searchItem" + this.ActiveItem];
    },

    moveUp: function(){
        var currentActiveResult = this.getCurrentActiveResult();
        var previousResult = this.getPreviousResult();

        if(currentActiveResult){
          currentActiveResult.removeActive();
        }

        if(previousResult){
          previousResult.addActive();
        }
    },

    moveDown: function(){
        var currentActiveResult = this.getCurrentActiveResult();
        var nextResult = this.getNextResult();

        if(currentActiveResult){
          currentActiveResult.removeActive();
        }

        if(nextResult){
          nextResult.addActive();
      }
    },

    // Handle navigating through the result set using arraw keys
    navigate: function (event) {
        var nextActiveItem = null;
        switch (event.which) {
        case 38: // up
            this.moveUp();
            break;
        case 40: // down
            this.moveDown();
            break;
        case 13: // enter        
            var id = $('#search-results .result.active').attr('data-id');
            AppActions.addIssue(id);            
            this.props.toggleResultsPanel(false);
            break;
        default:
            return; // exit this handler for other keys
        }
    },

    // React's magical render method 
    render: function() {
        var rows,
            items = this.props.results;

        if(items){
          rows = items.map(function(item, i) {
            var searchItemRef = "searchItem" + i;
            return(
              <SearchResultItem item={item} id={item.id} ref={searchItemRef}/>
            );
          });
        }

        return (
         	<div id="search-results" ref="searchResults">
             	<ul>
          	 		{rows}
             	</ul>
           	</div>
        );
    }

});

module.exports = SearchResult;