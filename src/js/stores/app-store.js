var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    StoreHelper = require('./store-helper'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    storeHelper = new StoreHelper();

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
    var onSearchBoxChange = function (payload) {
            this.emit(AppEvent.SearchBoxChange, payload);
        },
        onTaskListChange = function (payload) {
            this.emit(AppEvent.TaskListChange, payload);
        },
        addChangeListener = function (callback) {
            this.emit(AppEvent.SearchBoxChange, callback);
            this.emit(AppEvent.TaskListChange, callback);
        },
        removeChangeListeners = function (callback) {
            removeListener.call(this, AppEvent.SearchBoxChange, callback);
            removeListener.call(this, AppEvent.TaskListChange, callback);
        },
        dispatcherIndex = AppDispatcher.register(function (payload) {
            var action = payload.action;
            switch (action.actionType) {
            case AppConstants.FetchIssues:
                storeHelper.setSettings("<Track URL>", "<API KEY>");
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
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));