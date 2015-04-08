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
    addIssues: function(issueId){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.AddIssue,
            issueId:issueId
        });
    }
}

module.exports = AppActions;
