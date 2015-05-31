/*global require, module, $*/
var React = require('react'),
    SearchResultItem = require('../components/app-SearchItem'),
    AppActions = require('../actions/app-actions');

var SearchResult = React.createClass({
    ActiveItem : 0,
    _getCurrentActiveResult: function () {
        "use strict";
        return this.refs["searchItem" + this.ActiveItem];
    },
    _getNextResult: function () {
        "use strict";
        this.ActiveItem += 1;
        if (this.refs["searchItem" + this.ActiveItem]) {
            return this.refs["searchItem" + this.ActiveItem];
        }

        this.ActiveItem -= 1;
        return null;
    },
    _getPreviousResult: function () {
        "use strict";
        if (this.ActiveItem > 0) {
            this.ActiveItem -= 1;
            return this.refs["searchItem" + this.ActiveItem];
        }

        return null;
    },
    _clearCurrentActiveResult: function () {
        "use strict";
        var currentActiveResult = this._getCurrentActiveResult();
        if (currentActiveResult) {
            currentActiveResult._removeActive();
        }
    },
    _moveUp: function () {
        "use strict";
        var currentActiveResult = this._getCurrentActiveResult(),
            previousResult = this._getPreviousResult();

        if (currentActiveResult) {
            currentActiveResult._removeActive();
        }

        if (previousResult) {
            previousResult._addActive();
        }
    },

    _moveDown: function () {
        "use strict";
        var currentActiveResult = this._getCurrentActiveResult(),
            nextResult = this._getNextResult();

        if (currentActiveResult) {
            currentActiveResult._removeActive();
        }

        if (nextResult) {
            nextResult._addActive();
        }
    },
    _navigate: function (event) {
        "use strict";
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
            break;
        default:
            return; // exit this handler for other keys
        }
    },
    _togglePanel: function (show) {
        "use strict";
        this.props.toggleResultsPanel(show);
    },

    render: function () {
        "use strict";
        var rows,
            items = this.props.results,
            toggle = this._togglePanel,
            clear = this._clearCurrentActiveResult;

        if (items) {
            rows = items.map(function (item, i) {
                var searchItemRef = "searchItem" + i;
                return(<SearchResultItem item={item} togglePanel={toggle} clearCurrent={clear} ref={searchItemRef}/>);
            });
        }

        return (
            <div id="search-results" ref="searchResults">
                <div className="card">
                    <div className="card-main">
                        <div className="card-inner search-results-card-inner">
                            <ul>
                                {rows}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = SearchResult;