var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-manager'),
    DataManager = require('./data-manager'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper'),
    dataManager = null;

if(settings.available) {
    dataManager = new DataManager(new ServiceAccessor(settings.BaseURL, new HttpHelper(settings.APIKey)));
}

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
        var State = {
                fetchInProgress : false, // denotes weather issues are being fetched.
                filteredResult : [], // filtered search results.
                activeItems : [], // active tasks selected by the user.
                activities : [], // activities available to enter time against. Fetched from server.
                postedItems: [], // time posted task collection.
                isLoading : true,
                settings: settings
            },
            getState = function () {
                return State;
            },
            fetchData = function () {
                try {
                    if (settings.available) {
                        $.when(dataManager.fetchData(settings.TaskAssignee)).done(function () {
                            State.isLoading = false;
                            State.filteredResult = [];
                            dataManager.activityCollection.map(function(item) {
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
            fetchLatestBackground = function () {
                var intervalId  = setInterval(function () {
                    if (settings.available) {
                        $.when(dataManager.fetchLatest(settings.TaskAssignee)).done(function () {
                        }.bind(this)).fail(function (error) {
                            console.log(error);
                        });
                    }
                    else
                    {
                        clearInterval(intervalId);
                    }
                }.bind(this), 1800000);
            },
            fetchLatest = function () {
                try {
                    if (settings.available) {
                        $.when(dataManager.fetchLatest(settings.TaskAssignee)).done(function () {
                            State.isLoading = false;
                            State.filteredResult = [];
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
                        State.filteredResult = dataManager.filterTaskCollection(query);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            createActiveTask = function (issueId) {
                try {
                    State.filteredResult = [];
                    dataManager.createActiveTask(issueId);
                    State.activeItems = dataManager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                } catch(error) {
                    console.log(error);
                }
            },
            updateActiveTask =  function (entry) {
                try {
                    State.filteredResult = [];
                    dataManager.updateActiveTask(entry.id, entry.hours, entry.activityId, entry.comments);
                    EventEmitter.prototype.emit(AppEvent.Change);
                } catch (error) {
                    console.log(error);
                }
            },
            removeActiveTask = function (entryId) {
                try {
                    State.filteredResult = [];
                    dataManager.removeActiveTask(entryId);
                    EventEmitter.prototype.emit(AppEvent.Change);
                } catch (error) {
                    console.log(error);
                }
            },
            postUpdatedActiveTaskCollection = function () {
                try {
                    State.filteredResult = [];
                    $.when(dataManager.postUpdatedActiveTaskCollection(settings.getTimeEntryDate())).done(function () {
                        State.postedItems.concat(dataManager.timePostedTaskCollection);
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
                    $.when(settings.setSettings(data.url, data.apiKey, data.assignee)).done(function () {
                    }).fail(function (error) {
                        console.log(error);
                    });
                } catch (error) {
                    console.log(error);
                }
            },
            setTimeEntryDay = function (timeEntryDay) {
                try {
                    settings.setTimeEntryDay(timeEntryDay);
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
                        fetchLatestBackground.call(this);
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
                    case AppConstants.RemoveTimeEntry:
                        removeActiveTask.call(this, action.taskId);
                        break;
                    case AppConstants.RefreshIssues:
                        fetchLatest.call(this);
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
