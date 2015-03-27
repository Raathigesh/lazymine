var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var ServiceAccessor = require('./service-accessor.js');

var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = "Change";
var DATA_EVENT = "DataFetched";

function _createTimeEntries() {
    "use strict";
    var accessor = new ServiceAccessor(AppConstants.BASE_URL, ""),
        successCallback = function (data) {
            debugger;
        },
        failCallback = function (jqXHR, textStatus, errorThrown) {
            debugger;
        };
    
    var issues = [];
    issues.push({
      "time_entry": {
        "issue_id": "27110",
        "spent_on": "2015-03-26",
        "hours": "0.5",
        "activity_id": "12",
        "comments": ""
      }
    });
    
    accessor.createTimeEntries(issues, successCallback, failCallback);
}

function _getTimeEntryActivities() {
    var accessor = new ServiceAccessor(AppConstants.BASE_URL, "e0abd8e540c8fb88f10250405c0639309d7cf4b5"),
        successCallback = function (data) {
            debugger;
        },
        failCallback = function (jqXHR, textStatus, errorThrown) {
            debugger;
        };
    accessor.getTimeEntryActivities(successCallback, failCallback)
}

function _search(text) {
    "use strict";
    var accessor = new ServiceAccessor(AppConstants.BASE_URL, "e0abd8e540c8fb88f10250405c0639309d7cf4b5"),
        successCallback = function (data) {
            debugger;
        },
        failCallback = function (jqXHR, textStatus, errorThrown) {
            debugger;
        };
    accessor.getAllIssues(successCallback, failCallback);
}

var appStore = merge(EventEmitter.prototype, {
    emitChange : function () {
        "use strict";
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        "use strict";
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        "use strict";
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        "use strict";
        var action = payload.action;
           
        switch (action.actionType) {
        case AppConstants.SEARCH:
            //_search(payload.action.searchText);
            //_getTimeEntryActivities();
                _createTimeEntries();
            break;
        }
        
        appStore.emitChange();
        return true;
    })
});

module.exports = appStore;