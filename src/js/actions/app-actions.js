var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
    search: function (text) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.SEARCH,
            searchText: text
        });
    }
}

module.exports = AppActions;