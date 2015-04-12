var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    StoreHelper = require('./store-helper'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    storeHelper = new StoreHelper();

var SearchResults,
    ActiveTasks;

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
    var onSearchBoxChange = function (payload) {
            SearchResults = payload;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        onTaskListChange = function (payload) {
            ActiveTasks = payload;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        addChangeListener = function (callback) {
            EventEmitter.prototype.on.call(this, AppEvent.Change, callback);
        },
        removeChangeListeners = function (callback) {
            removeListener.call(this, AppEvent.Change, callback);
        },
        getSearchResults = function(){
          return SearchResults;
        },
        getActiveTasks = function(){
          return ActiveTasks;
        },
        dispatcherIndex = AppDispatcher.register(function (payload) {
            var action = payload.action;
            switch (action.actionType) {
            case AppConstants.FetchIssues:
                storeHelper.setSettings("https://track.zone24x7.lk", "fc1ee0650bbe28d50a84ba9c87ffc403e2a06b78");
                storeHelper.fetchItems(function (callback) {
                    onSearchBoxChange.call(this, callback);
                });
                break;
            case AppConstants.Search:
                onSearchBoxChange.call(this, storeHelper.filter(action.query));
                break;
            case AppConstants.AddIssue:              
                onTaskListChange.call(this, storeHelper.addIssue(action.issueId));
                break;
            }
        });

    return {
        addChangeListener: addChangeListener,
        getSearchResults: getSearchResults,
        getActiveTasks: getActiveTasks,
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
