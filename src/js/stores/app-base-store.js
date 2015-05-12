var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    Merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-manager'),
    DataManager = require('./data-manager'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper'),
    prettify = require('prettify-error'),
    dataManager = null;

getDataManager = function () {
    if ((dataManager === null || settings.forceLoad) && settings.available) {
        settings.forceLoad = false;
        dataManager = new DataManager(new ServiceAccessor(settings.BaseURL, new HttpHelper(settings.APIKey)));
    }

    return dataManager;
};

module.exports = Merge(EventEmitter.prototype, (function () {
    "use strict";
    var State = {
            fetchInProgress: false, // denotes weather issues are being fetched.
            filteredResult: [], // filtered search results.
            activeItems: [], // active tasks selected by the user.
            activities: [], // activities available to enter time against. Fetched from server.
            isLoading: true,
            settings: settings
        },
        getState = function () {
            return State;
        },
        fetchData = function () {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    $.when(manager.fetchData(settings.TaskAssignee)).done(function () {
                        State.isLoading = false;
                        State.filteredResult = [];
                        manager.activityCollection.map(function (item) {
                            State.activities.push({
                                id: item.id,
                                text: item.name
                            });
                        }.bind(this));
                        fetchLatestBackground.call(this);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        console.error(prettify(error) || error);
                    });
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        fetchLatestBackground = function () {
            var intervalId = setInterval(function () {
                try {
                    var manager = getDataManager();
                    if (manager !== null) {
                        $.when(manager.fetchLatest(settings.TaskAssignee)).done(function () {
                        }.bind(this)).fail(function (error) {
                            console.error(prettify(error) || error);
                        });
                    }
                    else {
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.error(prettify(error) || error);
                }
            }.bind(this), settings.backgroundFetchTimerInterval);
        },
        fetchLatest = function () {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    $.when(manager.fetchLatest(settings.TaskAssignee)).done(function () {
                        State.isLoading = false;
                        State.filteredResult = [];
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        console.error(prettify(error) || error);
                    });
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        filterTaskCollection = function (query) {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    State.filteredResult = manager.filterTaskCollection(query);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        createActiveTask = function (issueId) {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    manager.createActiveTask(issueId);
                    State.activeItems = manager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        updateActiveTask = function (entry) {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    manager.updateActiveTask(entry.id, entry.hours, entry.activityId, entry.comments);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        removeActiveTask = function (entryId) {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    manager.removeActiveTask(entryId);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        postUpdatedActiveTaskCollection = function () {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    $.when(manager.postUpdatedActiveTaskCollection(settings.getTimeEntryDate())).done(function () {
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        console.error(prettify(error) || error);
                    });
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        clearActiveTaskCollection = function () {
            try {
                var manager = getDataManager();
                if(manager !== null) {
                    manager.clearActiveTaskCollection();
                    State.activeItems = manager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        setSettings = function (data) {
            try {
                $.when(settings.setSettings(data.url, data.apiKey, data.assignee)).done(function () {
                    EventEmitter.prototype.emit(AppEvent.Change);
                }).fail(function (error) {
                    console.error(prettify(error) || error);
                });
            } catch (error) {
                console.error(prettify(error) || error);
            }
        },
        setTimeEntryDay = function (timeEntryDay) {
            try {
                settings.setTimeEntryDay(timeEntryDay);
            } catch (error) {
                console.error(prettify(error) || error);
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
                    updateActiveTask.call(this, action.timeEntry);
                    break;
                case AppConstants.CreateTimeEntries:
                    postUpdatedActiveTaskCollection.call(this);
                    break;
                case AppConstants.ClearTimeEntries:
                    clearActiveTaskCollection.call(this);
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
