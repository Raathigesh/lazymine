var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
    search: function (text) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.SEARCH,
            searchText: text
        });
    }
}

module.exports = AppActions;