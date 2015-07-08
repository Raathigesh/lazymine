/*global require, module*/
var AppConstants = require('../constants/app-action-name'),
    AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = (function () {
    "use strict";
    var fetchIssues = function () {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.FetchIssues
            });
        },
        search = function (q) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.Search,
                query: q
            });
        },
        clearSearch = function () {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ClearSearch
            });
        },
        addIssue = function (issueId) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.AddIssue,
                issueId: issueId
            });
        },
        updateTaskActivityId = function (id, activityId) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.UpdateTaskActivityId,
                entry: {
                    id: id,
                    activityId: activityId
                }
            });
        },
        updateTaskHours = function (id, spentHours) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.UpdateTaskHours,
                entry: {
                    id: id,
                    hours: parseFloat(spentHours).toFixed(2)
                }
            });
        },
        updateTaskCustomField = function (id, customFieldId, customFieldValue) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.UpdateTaskCustomField,
                entry: {
                    id: id,
                    customFieldId: customFieldId,
                    customFieldValue: customFieldValue
                }
            });
        },
        updateTaskComments = function (id, comment) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.UpdateTaskComments,
                entry: {
                    id: id,
                    comments: comment
                }
            });
        },
        createTimeEntries = function (spentOn) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.CreateTimeEntries,
                spentOn: spentOn
            });
        },
        clearTimeEntries = function () {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ClearTimeEntries
            });
        },
        saveSettings = function (url, apiKey) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.SaveSettings,
                settings: {
                    url: url,
                    apiKey: apiKey
                }
            });
        },
        removeTimeEntry = function (taskId) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.RemoveTimeEntry,
                taskId: taskId
            });
        },
        refreshIssues = function () {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.RefreshIssues
            });
        },
        storeError = function (error) {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.StoreError,
                error: error
            });
        },
        logout = function () {
            AppDispatcher.handleViewAction({
                //actionType: AppConstants.Logout
                actionType: AppConstants.Logout
            });
        };
    return {
        fetchIssues: fetchIssues,
        search: search,
        clearSearch: clearSearch,
        addIssue: addIssue,
        updateTaskActivityId: updateTaskActivityId,
        updateTaskHours: updateTaskHours,
        updateTaskCustomField: updateTaskCustomField,
        updateTaskComments: updateTaskComments,
        createTimeEntries: createTimeEntries,
        clearTimeEntries: clearTimeEntries,
        saveSettings: saveSettings,
        removeTimeEntry: removeTimeEntry,
        refreshIssues: refreshIssues,
        storeError: storeError,
        logout: logout
    };
}());

module.exports = AppActions;
