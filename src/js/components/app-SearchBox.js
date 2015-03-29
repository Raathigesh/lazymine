/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/

/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store');
var AppActions = require('../actions/app-actions');
var ListItem = require('../components/app-SearchListItem');


// Main search list component
var SearchList = React.createClass({
    _change: function (data) {
      this.setState({
        "Items" :  data
      });
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
        switch (event.which) {
        case 38: // up
            var currentId = $('#search-results .result.active').attr('data-id');
            var prevId = parseInt(currentId, 10) - 1;
            $('#search-results .result').removeClass('active');
            if (!$('#search-results #result-' + prevId).length) return false;
            $('#search-results #result-' + prevId).addClass('active');
            break;

        case 40: // down
            if (!$('#search-results .result.active').length) {
                $('#search-results .result').first().addClass('active');
            } else {
                var currentId = $('#search-results .result.active').attr('data-id');
                var nextId = parseInt(currentId, 10) + 1;
                if (!$('#search-results #result-' + nextId).length) return false;
                $('#search-results .result').removeClass('active');
                $('#search-results #result-' + nextId).addClass('active');
            }
            break;

        case 13: // enter
            var id = $('#search-results .result.active').attr('data-id');
            AppActions.addIssues(id);
            break;

        default:
            return; // exit this handler for other keys
        }
    },

    // Initial states with no items
    getInitialState: function () {
      return {
       "Items": null
      };
    },

    // React's magical render method
    render: function() {
        var rows,
            items = this.state.Items;

        if(items){
          rows = items.map(function(item, i) {
            return(
              <ListItem item={item} id={item.id}/>
            );
          });
        }

        return (
            <div>
               <input id="search" type="text" placeholder="Start typing..." onChange={this.filter} onKeyDown={this.navigate}/>
               <div id="search-results">
                <ul>
                  {rows}
                </ul>
              </div>
            </div>
        );
    }
});

module.exports = SearchList;
