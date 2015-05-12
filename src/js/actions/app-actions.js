var AppConstants = require('../constants/app-action-name');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
    fetchIssues: function () {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.FetchIssues
        });
    },
    search: function (q) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.Search,
            query: q
        });
    },
    addIssue: function (issueId) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.AddIssue,
            issueId: issueId
        });
    },
    updateTaskActivityId: function (id, activityId) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.UpdateTaskActivityId,
            entry: {
                id: id,
                activityId: activityId
            }
        });
    },
    updateTaskHours: function (id, spentHours) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.UpdateTaskHours,
            entry: {
                id: id,
                hours: spentHours
            }
        });
    },
    updateTaskComments: function (id, comment) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.UpdateTaskComments,
            entry: {
                id: id,
                comments: comment
            }
        });
    },
    createTimeEntries: function () {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CreateTimeEntries
        });
    },
    clearTimeEntries: function () {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.ClearTimeEntries
        });
    },
    saveSettings: function (url, apiKey, assignee) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.SaveSettings,
            settings: {
                url: url,
                apiKey: apiKey,
                assignee: assignee
            }
        });
    },
    removeTimeEntry: function (taskId) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.RemoveTimeEntry,
            taskId: taskId
        });
    },
    refreshIssues: function () {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.RefreshIssues
        });
    },
    storeError: function (error) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.StoreError,
            error: error
        });
    }
};

module.exports = AppActions;
