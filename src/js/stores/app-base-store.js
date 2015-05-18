/*global require, module, setInterval, clearInterval, console*/
var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-manager'),
    DataManager = require('./data-manager'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper'),
    prettify = require('prettify-error'),
    StoreError = require('../constants/store-errors'),
    $ = require("jquery"),
    dataManager = null;

var getDataManager = function () {
    "use strict";
    if ((dataManager === null || settings.forceLoad) && settings.available) {
        settings.forceLoad = false;
        dataManager = new DataManager(new ServiceAccessor(settings.BaseURL, new HttpHelper(settings.APIKey)));
    }

    return dataManager;
};

module.exports = merge(EventEmitter.prototype, (function () {
    "use strict";
    var State = {
            fetchInProgress: false, // denotes weather issues are being fetched.
            filteredResult: [], // filtered search results.
            activeItems: [], // active tasks selected by the user.
            activities: [], // activities available to enter time against. Fetched from server.
            isLoading: true,
            settings: settings,
            error: null
        },
        handleError = function (error) {
            State.error = error;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        getState = function () {
            return State;
        },
        fetchLatestBackground = function () {
            var intervalId = setInterval(function () {
                try {
                    var manager = getDataManager();
                    if (manager !== null) {
                        $.when(manager.fetchLatest()).fail(function (error) {
                            handleError(error);
                        });
                    } else {
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    handleError(StoreError.InternalServerError);
                    console.error(prettify(error) || error);
                }
            }.bind(this), settings.backgroundFetchTimerInterval);
        },
        fetchLatest = function () {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    $.when(manager.fetchLatest()).done(function () {
                        State.isLoading = false;
                        State.filteredResult = [];
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        handleError(error);
                    });
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        fetchData = function () {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    $.when(manager.fetchData()).done(function () {
                        State.isLoading = false;
                        State.filteredResult = [];
                        manager.activityCollection.map(function (item) {
                            State.activities.push({
                                id: item.id,
                                text: item.name
                            });
                        }.bind(this));

                        if (settings.fetchTaskCollection()) {
                            manager.createActiveTaskCollection(settings.timeEntryCollection);
                            State.activeItems = manager.activeTaskCollection;
                        }
                        fetchLatestBackground.call(this);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        handleError(error);
                    });
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        filterTaskCollection = function (query) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    State.filteredResult = manager.filterTaskCollection(query);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        clearSearch = function () {
            try {
                State.filteredResult = [];
                EventEmitter.prototype.emit(AppEvent.Change);
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        createActiveTask = function (issueId) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.createActiveTask(issueId);
                    State.activeItems = manager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        updateActiveTaskActivityId = function (entry) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.updateActiveTaskActivityId(entry.id, entry.activityId);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        updateActiveTaskComments = function (entry) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.updateActiveTaskComments(entry.id, entry.comments);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        updateActiveTaskHours = function (entry) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.updateActiveTaskHours(entry.id, entry.hours);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        removeActiveTask = function (entryId) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.removeActiveTask(entryId);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        postUpdatedActiveTaskCollection = function (spentOn) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    $.when(manager.postUpdatedActiveTaskCollection(spentOn)).done(function () {
                        settings.setTaskCollection(manager.getPostedTaskCollection());
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        handleError(error);
                    });
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        clearActiveTaskCollection = function () {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.clearActiveTaskCollection();
                    State.activeItems = manager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                handleError(StoreError.InternalServerError);
                console.error(prettify(error) || error);
            }
        },
        setSettings = function (data) {
            try {
                $.when(settings.setSettings(data.url, data.apiKey)).done(function () {
                    EventEmitter.prototype.emit(AppEvent.Change);
                }).fail(function (error) {
                    handleError(error);
                });
            } catch (error) {
                handleError(StoreError.InternalServerError);
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
            // Clear the current error as its shown to the user already.
            State.error = null;

            var action = payload.action;
            switch (action.actionType) {
            case AppConstants.FetchIssues:
                fetchData.call(this);
                break;
            case AppConstants.Search:
                filterTaskCollection.call(this, action.query);
                break;
            case AppConstants.ClearSearch:
                clearSearch.call();
                break;
            case AppConstants.AddIssue:
                createActiveTask.call(this, action.issueId);
                break;
            case AppConstants.UpdateTaskActivityId:
                updateActiveTaskActivityId.call(this, action.entry);
                break;
            case AppConstants.UpdateTaskComments:
                updateActiveTaskComments.call(this, action.entry);
                break;
            case AppConstants.UpdateTaskHours:
                updateActiveTaskHours.call(this, action.entry);
                break;
            case AppConstants.CreateTimeEntries:
                postUpdatedActiveTaskCollection.call(this, action.spentOn);
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
