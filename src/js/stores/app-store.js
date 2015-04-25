var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    StoreHelper = require('./store-helper'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    storeHelper = new StoreHelper();

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
        var State = {
            fetchInProgress : false, // denotes weather issues are being fetched.
            filteredResult : [], // filtered search results.
            activeItems : null, // active tasks selected by the user.
            activities : null // activities available to enter time against. Fetched from server.
        },
        getState = function () {
            return State;
        },
        onSearchBoxChange = function (payload) {
            State.filteredResult = payload.data; // set the newly filtered data.
            EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
        },
        onTaskListChange = function (payload) {            
            State.activeItems = payload.data; // set the new set of active items.
            EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
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
                    //SearchProcess = callback;
                });
                storeHelper.fetchTimeEntryActivities(function (callback) {
                    State.activities = storeHelper.getTimeEntryActivities().data;
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
        getState: getState,
        addChangeListener: addChangeListener, 
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
