var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');
var ServiceAccessor = require('./service-accessor');

var merge = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "Change";
var DATA_EVENT = "DataFetched";

var Issues = new Array();
var ActiveIssues = new Array();

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

function _fetchItems() {
    "use strict";
    var accessor = new ServiceAccessor(AppConstants.BASE_URL, "fc1ee0650bbe28d50a84ba9c87ffc403e2a06b78"),
        successCallback = function (data) {
          var arrayItems = $.makeArray( data );
          Issues = arrayItems;
        },
        failCallback = function (jqXHR, textStatus, errorThrown) {
            debugger;
        };
    accessor.getAllIssues(successCallback, failCallback);
}

var appStore = merge(EventEmitter.prototype, {
    emitChange : function (payload) {
        "use strict";
        this.emit(CHANGE_EVENT, payload);
    },
    addChangeListener: function (callback) {
        "use strict";
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        "use strict";
        this.removeListener(CHANGE_EVENT, callback);
    },
    filter: function(q){
      var items = Issues;
      var newItems = [];

      items.map(function(item, i) {
          if (typeof item === "undefined")
              return;

          var qLower = q.toLowerCase();
          var titleLower = item.subject.toLowerCase();
          var formattedTitle = highlight(item.subject, q);

          item.formattedTitle = formattedTitle;

          // Add custom search criteria here
          if (titleLower.indexOf(qLower) !== -1) {
              newItems.push(item);
          }
      });

      // When query is empty, reset the results
      if (!q) newItems = [];

      appStore.emitChange(newItems);

    },
    getIssueById: function(issueId){
      for (index = 0; index < Issues.length; ++index) {
         if(Issues[index].id == issueId){
           return Issues[index];
         }
      }
    },
    addIssue: function(issueId){
        var issue = this.getIssueById(issueId);
        ActiveIssues.push(issue);
        appStore.emitChange();
    },
    getSelectedIssues: function(){
       return ActiveIssues;
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        "use strict";
        var action = payload.action;
        switch (action.actionType) {
        case AppConstants.FetchIssues:
            _fetchItems();
            //_getTimeEntryActivities();
            //_createTimeEntries();
            break;
        case AppConstants.Search:
            appStore.filter(action.query);
            break;
        case AppConstants.AddIssue:
            appStore.addIssue(action.issueId);
            break;
        }
    })
});

function preg_quote( str ) {
  return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function highlight(data, search){
    return data.replace( new RegExp( "(" + preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
}

module.exports = appStore;
