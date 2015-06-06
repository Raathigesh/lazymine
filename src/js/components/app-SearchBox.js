/*global require, module, setTimeout*/
/** @jsx React.DOM */
var React = require('react'),
    AppStore = require('../stores/app-base-store'),
    AppActions = require('../actions/app-actions'),
    SearchResult = require('../components/app-SearchResult'),
    Menu = require('../components/app-Menu'),
    Rx = require('rx'),
    EventHandler = require('../util/eventHandler');

var SearchBox = React.createClass({
    ActiveItem: 0,
    MinimumQueryLength: 2,
    getInitialState: function () {
        "use strict";
        return {
            "showResults": true
        };
    },
    componentWillMount: function () {
        "use strict";
        /*Search requests to the store are throttled with the help of RxJs to 
         * minimize the performance hit */
        var filter = EventHandler.create();
            filter.select(function (event) {
                return event.target.value;
            })
            .skipWhile(function (query) {
                return query.length < this.MinimumQueryLength;
            }.bind(this))
            .throttle(500)
            .distinctUntilChanged()
            .subscribe(function (query) {
                if (query.length > this.MinimumQueryLength) {
                    AppActions.search(query);
                    this._toggleResultsPanel(true);
                    if (this.refs.searchResult._getCurrentActiveResult()) {
                        this.refs.searchResult._getCurrentActiveResult()._addActive();
                    }
                } else {
                    //clear the search results on the removing the filter text
                    //so that it'll not be picked when search box focused
                    AppActions.clearSearch();
                    this._toggleResultsPanel(false);
                }
            }.bind(this));

        this.filter = filter;
    },
    _toggleResultsPanel: function (show) {
        "use strict";
        this.setState({
            "showResults": show
        });
    },

    _navigate: function (event) {
        "use strict";
        this.refs.searchResult._navigate(event);
    },

    _showResults: function () {
        "use strict";
        this._toggleResultsPanel(true);
    },
    _hideResults: function () {
        "use strict";
        //setTimeout is there to handle the special event handling issue with onBlur
        setTimeout(function () {
            this._toggleResultsPanel(false);
        }.bind(this), 200);
    },
    render: function () {
        "use strict";
        return (
            <div className="search-row">
                <div className="col-md-12 search-box">
                    <input id="search" ref="searchBox" type="text" className="form-control search-control" 
                        onChange={this.filter} onKeyUp={this._navigate} onFocus={this._showResults} onClick={this._showResults}
                        onBlur={this._hideResults} placeholder="Type name or use tags #p #id #t #a ..."/>
                    <Menu />
                    {
                        this.state.showResults
                            ? <SearchResult ref="searchResult" results={this.props.items}
                                            toggleResultsPanel={this._toggleResultsPanel}/>
                            : null
                    }
                </div>
            </div>
        );
    }
});

module.exports = SearchBox;