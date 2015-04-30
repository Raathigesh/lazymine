var React = require('react');
var SearchResultItem = require('../components/app-SearchItem');
var AppActions = require('../actions/app-actions');

var SearchResult = React.createClass({

    ActiveItem : 0,

    _getCurrentActiveResult: function(){        
        return this.refs["searchItem" + this.ActiveItem];
    },

    _getNextResult: function(){
        this.ActiveItem += 1;
        if(this.refs["searchItem" + this.ActiveItem]){
            return this.refs["searchItem" + this.ActiveItem];
        }
        else {
            this.ActiveItem -= 1;
            return null;
        }
    },

    _getPreviousResult: function(){
        if(this.ActiveItem > 0){
            this.ActiveItem -= 1;
            return this.refs["searchItem" + this.ActiveItem];
        }
        else {
            return null;
        }
    },
    
    _clearCurrentActiveResult: function(){
        var currentActiveResult = this._getCurrentActiveResult();
        
        if(currentActiveResult){
          currentActiveResult._removeActive();
        }       
    },

    _moveUp: function(){        
        var currentActiveResult = this._getCurrentActiveResult();
        var previousResult = this._getPreviousResult();

        if(currentActiveResult){
            currentActiveResult._removeActive();
        }

        if(previousResult){
            previousResult._addActive();
        }       
    },

    _moveDown: function(){
        var currentActiveResult = this._getCurrentActiveResult();
        var nextResult = this._getNextResult();

        if(currentActiveResult){
          currentActiveResult._removeActive();
        }

        if(nextResult){
          nextResult._addActive();
        }
    },
    
    _navigate: function (event) {        
        switch (event.which) {
        case 38: // up
            this._moveUp();
            event.preventDefault();
            break;
        case 40: // down
            this._moveDown();
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

    _togglePanel: function(show){
        this.props.toggleResultsPanel(show);
    },

    render: function() {
        var rows,
            items = this.props.results,
            toggle = this.togglePanel,
            clear = this._clearCurrentActiveResult;

        if(items){
          rows = items.map(function(item, i) {
            var searchItemRef = "searchItem" + i;
            return(
              <SearchResultItem item={item} togglePanel={toggle} clearCurrent={clear} ref={searchItemRef}/>
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