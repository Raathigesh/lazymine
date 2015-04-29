var Lodash = require('lodash'),
    Validator = require('validator'),
    MessageText = require('../constants/message-text'),
    ServiceAccessor = require('./service-accessor'),
    ProcessStatus = require('./process-status');

var StoreHelper = function () {
    "use strict";
    this.settingsKey = "settings";
    this.serviceBase = null;
    this.settings = null;
    this.AllIssues = [];
    this.ActiveIssues = [];
    this.TimeEntryActivities = null;
};

StoreHelper.prototype = (function () {
    "use strict";
    var isValidUrl = function (url) {
            return Validator.isURL(url, {
                protocols: ['https']
            });
        },
        setSettings = function (baseUrl, apiKey) {
            if (!isValidUrl.call(this, baseUrl)) {
                return new ProcessStatus(false, MessageText.InvalidURL);
            }

            if (!apiKey) {
                return new ProcessStatus(false, MessageText.InvalidAPIKey);
            }

            var settings = {
                BaseURL: baseUrl,
                APIKey: apiKey
            };

            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            this.settings = settings;
            initServiceBase.call(this);
            return new ProcessStatus(true, MessageText.SaveSuccessful);
        },
        getSettings = function () {
            var storeSettings = localStorage.getItem(this.settingsKey);
      			if (storeSettings) {
              return JSON.parse(storeSettings);
      			}

            return null;
        },
        fetchSettings = function () {
            if (!this.settings) {
                var settingsCache = getSettings.call(this)
                if (settingsCache) {
                    this.settings = settingsCache;
                    return new ProcessStatus(true, MessageText.LoadSuccessful);
                } else {
                    return new ProcessStatus(false, MessageText.LoadFailure);
                }
            }

            return new ProcessStatus(true, MessageText.AlreadyLoaded);
        },
        initServiceBase = function () {
            if(!this.serviceBase) {
                this.serviceBase = new ServiceAccessor(this.settings.BaseURL, this.settings.APIKey);
            }
        },
        fetchItems = function (fetchCallback) {
          debugger;
            var fetchSettingsProcess = fetchSettings.call(this);
            if (!fetchSettingsProcess.status) {
                fetchCallback(fetchSettingsProcess);
            }

            initServiceBase.call(this);
            var successCallbackHandler = function (data) {
                    this.AllIssues = $.makeArray(data);
                    fetchCallback(new ProcessStatus(true, MessageText.FetchSuccessful, this.AllIssues));
                }.bind(this),
                failCallbackHandler = function (jqXHR, textStatus, errorThrown) {
                    fetchCallback(new ProcessStatus(false, MessageText.FetchFailure));
                }.bind(this);
            this.serviceBase.getAllIssues(successCallbackHandler, failCallbackHandler);
        },
        formatFilter = function (data, query) {
            return data.replace(new RegExp("(" + Validator.stripLow(query) + ")", 'gi'), "<b>$1</b>");
        },
        filter = function (query) {
            if(!this.AllIssues)
            {
                return new ProcessStatus(false, MessageText.NoIssuesAvailable);
            }

            var upperQueryParts = query.toUpperCase().split(' '),
                filterItems = Lodash.filter(this.AllIssues, function (item) {
                    item.matchCount = 0;

                    var parts = Lodash.filter(upperQueryParts, function(part) {
                        return part.length > 1;
                    });

                    var queryExpression = new RegExp("(?=.*" + parts.join(')(?=.*') + ")", 'gi'),
                        matchstrings = item.subject.match(queryExpression);

                    if(matchstrings)
                    {
                        item.matchCount += matchstrings.length
                    }


                    return item.matchCount > 0;
                });

            var sortedList = Lodash.sortByOrder(filterItems, ['matchCount'], [false]);

            sortedList.map(function (item) {
                item.formattedTitle = item.subject;
                upperQueryParts.map(function (part) {
                    if(part){
                      item.formattedTitle = formatFilter.call(this, item.formattedTitle, part);
                    }
                });
            });

            return new ProcessStatus(true, MessageText.IssueFilterSuccessful, sortedList);
        },
        addIssue = function (id) {
            var issue = Lodash.find(this.AllIssues, function (item) {
                    return item.id === parseInt(id);
                });
            if(!issue) {
                return new ProcessStatus(false, MessageText.IssueNotFound)
            }

            this.ActiveIssues.push(issue);
            return new ProcessStatus(true, MessageText.IssueAdded, this.ActiveIssues);
        },
        fetchTimeEntryActivities = function (fetchCallback) {
            initServiceBase.call(this);
            var successCallback = function (data) {
                    this.TimeEntryActivities = data;
                    fetchCallback(new ProcessStatus(true, MessageText.FetchSuccessful));
                }.bind(this),
                failCallback = function (jqXHR, textStatus, errorThrown) {
                    fetchCallback(new ProcessStatus(true, MessageText.FetchFailure, data));
                }.bind(this);
            this.serviceBase.getTimeEntryActivities(successCallback, failCallback)
        },
        getTimeEntryActivities = function () {
            if(!this.TimeEntryActivities)
            {
                return new ProcessStatus(false, MessageText.NoActivityAvailable);
            }

            return new ProcessStatus(true, MessageText.ActivityAvailable, this.TimeEntryActivities);
        },
        updateTime = function (timeEntry) {
           var validateTimeEntryProcess = validateTimeEntry.call(this, timeEntry);
           if(validateTimeEntryProcess.status) {
              return validateTimeEntryProcess;
           }

           var issue = Lodash.find(this.ActiveIssues, { 'id' : timeEntry.Id });
           if(issue) {
               issue.time_updated = true;
               issue.spent_on = timeEntry.spent_on;
               issue.hours = timeEntry.hours;
               issue.activity_id = timeEntry.activity_id;
               issue.comments = timeEntry.comments;
               return new ProcessStatus(true, MessageText.TimeUpdated);
           }
           else {
              return new ProcessStatus(false, MessageText.IssueNotFound);
           }
        },
        validateTimeEntry = function (timeEntry) {
            if(!timeEntry && !timeEntry.spent_on && !timeEntry.hours && !timeEntry.activity_id) {
                return new ProcessStatus(false, MessageText.InvalidTimeEntry);
            }
        },
        createTimeEntries = function (entryCallback) {
            initServiceBase.call(this);
            var successCallback = function (data) {
                    entryCallback(new ProcessStatus(true, MessageText.TimeEntrySuccessful))
                }.bind(this),
                failCallback = function (jqXHR, textStatus, errorThrown) {
                    entryCallback(new ProcessStatus(true, MessageText.TimeEntryFailure))
                }.bind(this);

            var updatedIssues = Lodash.filter(this.ActiveIssues, function (issue) {
                return issue.time_updated;
            });

            var updatedIssues = [];
            this.ActiveIssues.map(function (issue) {
                if(issue.time_updated) {
                  updatedIssues.push({
                        time_entry: {
                            issue_id: issue.issue_id,
                            spent_on: issue.spent_on,
                            hours: issue.hours,
                            activity_id: issue.activity_id,
                            comments: issue.comments
                        }
                    });
                }
            });

            this.serviceBase.createTimeEntries(updatedIssues, successCallback, failCallback);
        };

    return {
        setSettings: setSettings,
        fetchSettings: fetchSettings,
        fetchItems: fetchItems,
        filter: filter,
        addIssue: addIssue,
        fetchTimeEntryActivities: fetchTimeEntryActivities,
        getTimeEntryActivities: getTimeEntryActivities,
        createTimeEntries: createTimeEntries,
        updateTime: updateTime
    };
}());

module.exports = StoreHelper;
