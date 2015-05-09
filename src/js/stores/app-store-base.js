var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-store'),
    DataStore = require('./data-store'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper');

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
            fetchData = function () {
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
            },
            filterTaskCollection = function(query) {
                try{
                    if(settings.available) {
                        State.filteredResult = dataStore.filterTaskCollection(query);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            createActiveTask = function (issueId) {
                try {
                    dataStore.createActiveTask(issueId);
                    State.activeItems = dataStore.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                } catch(error) {
                    console.log(error);
                }
            },
            updateActiveTask =  function (entry) {
                try {
                    dataStore.updateActiveTask(entry.id, entry.hours, entry.activityId, entry.comments);
                    EventEmitter.prototype.emit(AppEvent.Change);
                } catch (error) {
                    console.log(error);
                }
            },
            postUpdatedActiveTaskCollection = function () {
                try {
                    $.when(dataStore.postUpdatedActiveTaskCollection()).done(function () {
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }).fail(function (error) {
                        console.log(error);
                    });
                } catch (error) {
                    console.log(error);
                }
            },
            setSettings = function (data) {
                try {
                    $.when(settings.setSettings(data.url, data.apiKey)).done(function () {
                    }).fail(function (error) {
                        console.log(error);
                    });
                } catch (error) {
                    console.log(error);
                }
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
                        fetchData.call(this);
                        break;
                    case AppConstants.Search:
                        filterTaskCollection.call(this, action.query);
                        break;
                    case AppConstants.AddIssue:
                        createActiveTask.call(this, action.issueId);
                        break;
                    case AppConstants.UpdateTime:
                        updateActiveTask.call(this,  action.timeEntry);
                        break;
                    case AppConstants.CreateTimeEntries:
                        postUpdatedActiveTaskCollection.call(this);
                        break;
                    case AppConstants.SaveSettings:
                        setSettings.call(this, action.settings);
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
