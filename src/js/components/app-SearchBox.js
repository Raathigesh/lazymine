/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/

/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var ListItem = require('../components/app-SearchListItem');


// Main search list component
var SearchList = React.createClass({
    ActiveItem : 0,
    _change: function () {
        var data = AppStore.getSearchResults();

        this.setState({
          "Items" :  data.data,
          "ShowResults" : true
        });
        this.ActiveItem = 0;

    },
    getCurrentActiveResult: function(){
      return "searchItem" + this.ActiveItem;
    },
    getNextResult: function(){
        this.ActiveItem += 1;
        return "searchItem" + this.ActiveItem;
    },
    getPreviousResult: function(){
        this.ActiveItem -= 1;
        return "searchItem" + this.ActiveItem;
    },
    moveUp: function(){
      var references = this.refs;
      references[this.getCurrentActiveResult()].removeActive();
      references[this.getPreviousResult()].addActive();
    },
    moveDown: function(){
      var references = this.refs;
      references[this.getCurrentActiveResult()].removeActive();
      references[this.getNextResult()].addActive();
    },
    componentWillMount: function () {
        AppStore.addChangeListener(this._change);
        AppActions.fetchIssues();
    },
    // Filters items as user types
    filter: function (event) {
        var q = event.target.value;
        AppActions.search(q);
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
            this.setState({
              "Items" :  null
            });
            React.findDOMNode(this.refs.searchBox).value = "";
            break;

        default:
            return; // exit this handler for other keys
        }
    },

    // Initial states with no items
    getInitialState: function () {
      return {
       "Items": null,
        "ActiveItem" : null,
        "ShowResults" : false
      };
    },

    // React's magical render method
    render: function() {
        var rows,
            items = this.state.Items;

        if(items){
          rows = items.map(function(item, i) {
            var searchItemRef = "searchItem" + i;
            return(
              <ListItem item={item} id={item.id} ref={searchItemRef}/>
            );
          });
        }

        return (
          <div className="col-md-12">
              <input id="search" ref="searchBox" type="text" className="search-control" onChange={this.filter} onKeyDown={this.navigate} placeholder="Type a name, id, #latest, #mine, #lastupdated..."/>
                <div id="search-results" ref="searchResults">
                 <ul>
                   {rows}
                 </ul>
               </div>
          </div>);
    }
});

module.exports = SearchList;
