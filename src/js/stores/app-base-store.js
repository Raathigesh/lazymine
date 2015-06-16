/*global require, module, setInterval, setTimeout, clearInterval, console*/
var AppConstants = require('../constants/app-action-name'),
    AppEvent = require('../constants/app-event'),
    AppDispatcher = require('../dispatchers/app-dispatcher'),
    merge = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    settings = require('./settings-manager'),
    DataManager = require('./data-manager'),
    ServiceAccessor = require('./service-accessor'),
    HttpHelper = require('./http-helper'),
    StoreError = require('../constants/store-errors'),
    StoreMessage = require('../constants/store-message'),
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
            error: null,
            customFields: []
        },
        showToast = function (error) {
            State.error = error;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        clearError = function () {
            State.error = null;
            EventEmitter.prototype.emit(AppEvent.Change);
        },
        getState = function () {
            // Added to test custom field UI implementation. SHOULD BE REMOVED.
             State.customFields = [];
             State.customFields.push({            
                "customized_type": "issue",
                "field_format": "list",
                "id": "159",
                "is_filter": "false",
                "is_required": "true",
                "multiple": "true",
                "name": "Value/Benefit",
                "possible_values": {
                    "type": "array",
                    "possible_values": [
                        {
                            "value": "Green",
                            "color": "Green"
                        },
                        {
                            "value": "Orange",
                            "color": "Orange"
                        },
                        {
                            "value": "Yellow",
                            "color": "Yellow"
                        },
                        {
                            "value": "Red",
                            "color": "Red"
                        },
                        {
                            "value": "Black",
                            "color": "Black"
                        }
                    ]
                },
                "searchable": "true",
                "visible": "false"
            });

            return State;
        },
        fetchLatestBackground = function () {
            var intervalId = setInterval(function () {
                try {
                    var manager = getDataManager();
                    if (manager !== null) {
                        if (!State.isLoading) {
                            $.when(manager.fetchLatest()).fail(function (error) {
                                showToast.call(this, error);
                            }.bind(this));
                        }
                    } else {
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    showToast.call(this, StoreError.InternalServerError);
                    console.error(error);
                }
            }.bind(this), settings.backgroundFetchTimerInterval);
        },
        fetchLatest = function () {
            try {
                var manager = getDataManager();
                if (State.isLoading) {
                    showToast.call(this, StoreError.DataFetchInProgress);
                    return null;
                }

                if (manager !== null) {
                    State.isLoading = true;
                    State.filteredResult = [];
                    clearError.call(this);
                    $.when(manager.fetchData()).done(function () {
                        State.isLoading = false;
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        showToast.call(this, error);
                        State.isLoading = false;
                        setTimeout(function () {
                            fetchLatest.call(this);
                        }.bind(this), settings.retryInterval);
                    }.bind(this));
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        fetchData = function () {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    clearError.call(this);
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
                            manager.createActiveTaskCollection(settings.activeTaskCollection);
                            State.activeItems = manager.activeTaskCollection;
                        }
                        fetchLatestBackground.call(this);
                        EventEmitter.prototype.emit(AppEvent.Change);
                    }.bind(this)).fail(function (error) {
                        showToast.call(this, error);
                        setTimeout(function () {
                            fetchData.call(this);
                        }.bind(this), settings.retryInterval);
                    }.bind(this));
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        filterTaskCollection = function (query) {
            try {
                var manager = getDataManager();
                if (!State.isLoading && manager !== null) {
                    State.filteredResult = manager.filterTaskCollection(query);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        clearSearch = function () {
            try {
                State.filteredResult = [];
                EventEmitter.prototype.emit(AppEvent.Change);
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        createActiveTask = function (issueId) {
            try {
                if (!issueId) {
                    return null;
                }

                var manager = getDataManager();
                if (manager !== null) {
                    manager.createActiveTask(issueId);
                    settings.setTaskCollection(manager.getActiveTaskCollection());
                    State.activeItems = manager.activeTaskCollection;
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
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
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
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
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
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
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        updateActiveTaskCustomField = function (entry) {
            debugger
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.updateActiveTaskCustomField(entry.id, entry.customFieldId, entry.customFieldValue);
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        removeActiveTask = function (entryId) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.removeActiveTask(entryId);
                    settings.setTaskCollection(manager.getActiveTaskCollection());
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        postUpdatedActiveTaskCollection = function (spentOn) {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    $.when(manager.postUpdatedActiveTaskCollection(spentOn)).done(function () {
                        showToast.call(this, StoreMessage.TimeUpdateSuccessful);
                    }.bind(this)).fail(function (error) {
                        showToast.call(this, error);
                    }.bind(this));
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        clearActiveTaskCollection = function () {
            try {
                var manager = getDataManager();
                if (manager !== null) {
                    manager.clearActiveTaskCollection();
                    State.activeItems = manager.activeTaskCollection;
                    settings.setTaskCollection(manager.getActiveTaskCollection());
                    EventEmitter.prototype.emit(AppEvent.Change);
                }
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        setSettings = function (data) {
            try {
                $.when(settings.setSettings(data.url, data.apiKey)).done(function () {
                    EventEmitter.prototype.emit(AppEvent.Change);
                }.bind(this)).fail(function (error) {
                    showToast.call(this, error);
                }.bind(this));
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
            }
        },
        resetState = function () {
            State = {
                fetchInProgress: false,
                filteredResult: [],
                activeItems: [],
                activities: [],
                isLoading: true,
                settings: settings,
                error: null
            };
        },
        clearSettings = function () {
            try {
                if (State.isLoading) {
                    showToast.call(this, StoreError.DataFetchInProgress);
                    return null;
                }

                settings.clearSettings();
                resetState.call(this);
                EventEmitter.prototype.emit(AppEvent.Change);
            } catch (error) {
                showToast.call(this, StoreError.InternalServerError);
                console.error(error);
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
            case AppConstants.UpdateTaskCustomField:
                updateActiveTaskCustomField.call(this, action.entry);
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
            case AppConstants.Logout:
                clearSettings.call(this);
                break;
            case AppConstants.UpdateTaskCustomField:
                updateActiveTaskCustomField.call(this, action.entry);
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