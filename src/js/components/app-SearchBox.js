/*Modification of http://tonyspiro.com/dev/react-typeahead-search*/

/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
var ListItem = require('../components/app-SearchListItem.js');

// Main search list component
var SearchList = React.createClass({
    dataItems: {},
    _dataAvailable: function (data) {
        this.dataItems = data;
    },
    componentWillMount: function () {
        AppStore.addDataListener(this._dataAvailable);
        AppActions.search();
    },

    // Filters items as user types
    filter: function (event) {
        var items = this.dataItems;

        var newItems = [];
        var q = event.target.value;

        for (i = 0; i < Object.keys(items).length; ++i) {
            var item = items[i];

            if (typeof item === "undefined")
                return;

            var qLower = q.toLowerCase();
            var titleLower = item.subject.toLowerCase();
            // var contentLower = item.content.toLowerCase();
            var formattedTitle = highlight(item.subject, q);
            // var formattedContent = highlight(item.subject, q);

            // item.formattedContent = formattedContent;
            item.formattedTitle = formattedTitle;

            // Add custom search criteria here
            if (titleLower.indexOf(qLower) !== -1) {
                newItems.push(item);
            }
        }

        // When query is empty, reset the results
        if (!q) newItems = [];

        // Set the new filtered items to state and let the react magic happen.
        if (this.isMounted()) {
            this.setState({
                data: {
                    items: newItems
                }
            });
        }
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
            var link = $('#search-results .result.active').attr('href');
            window.open(link, '_blank');
            break;

        default:
            return; // exit this handler for other keys
        }
    },

    // Initial states with no items
    getInitialState: function () {
        return {
            data: {
                "items": []
            }
        };
    },
    // React's magical render method
    render: function() {
        var rows;
        var items = this.state.data.items;

        rows = items.map(function(item, i) {
          return(
            <ListItem item={item} id={i}/>
          );
        });

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

function preg_quote( str ) {
  return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function highlight(data, search){
    return data.replace( new RegExp( "(" + preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
}

module.exports = SearchList;
