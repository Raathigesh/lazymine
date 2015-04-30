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
		if(this.refs["searchItem" + this.ActiveItem]){
			return this.refs["searchItem" + this.ActiveItem];
		}
		else {
			this.ActiveItem -= 1;
			return null;
		}
    },

    getPreviousResult: function(){
		if(this.ActiveItem > 0){
			this.ActiveItem -= 1;
			return this.refs["searchItem" + this.ActiveItem];
		}
		else {
			return null;
		}
    },
	
	clearCurrentActiveResult: function(){
		var currentActiveResult = this.getCurrentActiveResult();
		
		if(currentActiveResult){
		  currentActiveResult.removeActive();
		}		
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
        switch (event.which) {
        case 38: // up
            this.moveUp();
			event.preventDefault();
            break;
        case 40: // down
            this.moveDown();
			event.preventDefault();
            break;
        case 13: // enter        
            var id = $('#search-results .result.active').attr('data-id');
            AppActions.addIssue(id);            
            this.props.toggleResultsPanel(false);
            break;
		case 27: // esc
			this.props.toggleResultsPanel(false);
        default:
            return; // exit this handler for other keys
        }
    },

    togglePanel: function(show){
        this.props.toggleResultsPanel(show);
    },

    // React's magical render method 
    render: function() {
        var rows,
            items = this.props.results,
            toggle = this.togglePanel,
			clear = this.clearCurrentActiveResult;

        if(items){
          rows = items.map(function(item, i) {
            var searchItemRef = "searchItem" + i;
            return(
              <SearchResultItem item={item} id={item.id} togglePanel={toggle} clearCurrent={clear} ref={searchItemRef}/>
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