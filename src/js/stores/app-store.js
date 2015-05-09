var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./Settings'),
    DataStore = require('./DataStore'),
    ServiceAccessor = require('./ServiceAccessor'),
    HttpHelper = require('./HttpHelper');

var dataStore = new DataStore(new ServiceAccessor(settings.BaseURL, new HttpHelper(settings.APIKey)));

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
        var State = {
            fetchInProgress : false, // denotes weather issues are being fetched.
            filteredResult : [], // filtered search results.
            activeItems : [], // active tasks selected by the user.
            activities : [], // activities available to enter time against. Fetched from server.
            isLoading : true
        },
        getState = function () {
            return State;
        },
        getSettings = function(){
            return settings;
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
                    try {
                        if (settings.available) {
                            $.when(dataStore.fetchData()).done(function () {
                                State.isLoading = false;
                                dataStore.activityCollection.map(function(item) {
                                    State.activities.push({
                                        id: item.id,
                                        text: item.name
                                    });
                                }.bind(this));
                                EventEmitter.prototype.emit(AppEvent.Change);
                            }.bind(this)).fail(function (error) {
                                console.log(error);
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case AppConstants.Search:
                    try{
                        if(settings.available) {
                            State.filteredResult = dataStore.filterTaskCollection(action.query); // set the newly filtered data.
                            EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case AppConstants.AddIssue:
                    try {
                        dataStore.createActiveTask(action.issueId);
                        State.activeItems = dataStore.activeTaskCollection; // set the new set of active items.
                        EventEmitter.prototype.emit(AppEvent.Change); // notify view about the change.
                    } catch(error) {
                        console.log(error);
                    }
                    break;
                case AppConstants.UpdateTime:
                    try {
                        var entry = action.timeEntry;
                        dataStore.updateActiveTask(entry.id, entry.hours, entry.activityId, entry.comments);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case AppConstants.CreateTimeEntries:
                    try {
                        $.when(dataStore.postUpdatedActiveTaskCollection()).done(function () {
                            EventEmitter.prototype.emit(AppEvent.Change);
                        }).fail(function (error) {
                            console.log(error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case AppConstants.SaveSettings:
                    try {
                        $.when(settings.setSettings(action.settings.url, action.settings.apiKey)).done(function () {
                        }).fail(function (error) {
                            console.log(error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                }
        });

    return {
        getState: getState,
        getSettings: getSettings,
        addChangeListener: addChangeListener,
        removeChangeListeners: removeChangeListeners,
        dispatcherIndex: dispatcherIndex
    };
}()));
