var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    StoreHelper = require('./store-helper'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    storeHelper = new StoreHelper();

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
    var SearchProcess = null,
        ActiveProcess = null,
        getSearchResultProcess = function () {
            return SearchProcess;
        },
        getActiveTaskProcess = function () {
            return ActiveProcess;
        },
        onSearchBoxChange = function (payload) {
            SearchProcess = payload;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        onTaskListChange = function (payload) {
            ActiveProcess = payload;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        addChangeListener = function (callback) {
            EventEmitter.prototype.on(AppEvent.Change, callback);
        },
        removeChangeListeners = function (callback) {
            EventEmitter.prototype.removeListener(AppEvent.Change, callback);
        },
        dispatcherIndex = AppDispatcher.register(function (payload) {
            var action = payload.action;
            switch (action.actionType) {
            case AppConstants.FetchIssues:
                storeHelper.setSettings("", "");
                storeHelper.fetchItems(function (callback) {
                    SearchProcess = callback;
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
        getSearchResultProcess: getSearchResultProcess,
        getActiveTaskProcess: getActiveTaskProcess,
        addChangeListener: addChangeListener,
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
