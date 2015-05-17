/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-base-store');
var AppActions = require('../actions/app-actions');
var SearchResult = require('../components/app-SearchResult');
var Rx = require('rx');
var EventHandler = require('../util/eventHandler');

var SearchBox = React.createClass({

    ActiveItem: 0,
    MinimumQueryLength: 2,

    getInitialState: function () {
        return {
            "showResults": true
        };
    },

    componentWillMount: function () {
        /*Search requests to the store are throttled with the help of RxJs to 
         * minimize the performance hit */
        var filter = EventHandler.create();

        filter.select(function (event) {
            return event.target.value;
        })
            .skipWhile(function (query) {
                return query.length < this.MinimumQueryLength;
            })
            .throttle(500)
            .distinctUntilChanged()
            .subscribe(function (query) {
                if (query.length > this.MinimumQueryLength) {
                    AppActions.search(query);
                    this._toggleResultsPanel(true);
                    if (this.refs.searchResult._getCurrentActiveResult()) {
                        this.refs.searchResult._getCurrentActiveResult()._addActive();
                    }
                }
                else {
                    //clear the search results on the removing the filter text
                    //so that it'll not be picked when search box focused
                    AppActions.clearSearch();
                    this._toggleResultsPanel(false);
                }
            }.bind(this));

        this.filter = filter;
    },

    _toggleResultsPanel: function (show) {
        this.setState({
            "showResults": show
        });
    },

    _navigate: function (event) {
        this.refs.searchResult._navigate(event);
    },

    _showResults: function () {
        this._toggleResultsPanel(true);
    },

    render: function () {
        return (
            <div className="row">
                <div className="col-md-12 search-box">
                    <input id="search" ref="searchBox" type="text" className="form-control search-control" onChange={this.filter}
                           onKeyUp={this._navigate} onFocus={this._showResults}
                           placeholder="Type a name, id, #latest, #mine, #lastupdated..."/>
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