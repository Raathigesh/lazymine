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
            query:q
        });
    },
    addIssue: function(issueId){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.AddIssue,
            issueId:issueId
        });
    },
    updateTime: function(id, activityId, spentHours, comment){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.UpdateTime,
            timeEntry: {
                id: id,
                hours: spentHours,
                activityId: activityId,
                comments: comment
            }
        });
    },
    createTimeEntries: function(){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CreateTimeEntries
        });
    },
    saveSettings: function(url, apiKey){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.SaveSettings,
            settings: {
                url : url,
                apiKey: apiKey
            }
        });
    },
    removeTimeEntry: function(taskId){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.RemoveTimeEntry,
            taskId: taskId
        });
    }
}

module.exports = AppActions;
