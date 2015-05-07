var _ = require('lodash'),
    moment = require('moment'),
    Validator = require('validator'),
    MessageText = require('../constants/message-text'),
    ServiceAccessor = require('./ServiceAccessor'),
    ProcessStatus = require('./process-status'),
    HttpHelper = require('./HttpHelper'),
    TimeEntry = require('./TimeEntry');

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
                this.serviceBase = new ServiceAccessor(this.settings.BaseURL, new HttpHelper(this.settings.APIKey));
            }
        },
        fetchItems = function (fetchCallback) {
            var fetchSettingsProcess = fetchSettings.call(this);
            if (!fetchSettingsProcess.status) {
                fetchCallback(fetchSettingsProcess);
            }

            initServiceBase.call(this);
            var successCallbackHandler = function (data) {
                    this.AllIssues = $.makeArray(data);
                    fetchCallback(new ProcessStatus(true, MessageText.FetchSuccessful, this.AllIssues));
                }.bind(this),
                failCallbackHandler = function () {
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
                filterItems = _.filter(this.AllIssues, function (item) {
                    item.matchCount = 0;

                    var parts = _.filter(upperQueryParts, function(part) {
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

            var sortedList = _.sortByOrder(filterItems, ['matchCount'], [false]);

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
            var issue = _.find(this.AllIssues, function (item) {
                    return item.id === parseInt(id);
                });
            if(!issue) {
                return new ProcessStatus(false, MessageText.IssueNotFound)
            }

            this.ActiveIssues.push(TimeEntry.createInstance(issue.id, issue.subject, issue.project.name));
            return new ProcessStatus(true, MessageText.IssueAdded, this.ActiveIssues);
        },
        updateTimeEntry = function (timeEntry) {
            var entry = _.find(this.ActiveIssues, { 'id': timeEntry.id }),
                today = moment().format("YYYY-MM-DD");

            entry.updateEntry(today, parseInt(timeEntry.hours), timeEntry.activityId, timeEntry.comments);
        },
        fetchTimeEntryActivities = function (fetchCallback) {
            initServiceBase.call(this);
            var successCallback = function (data) {
                    this.TimeEntryActivities = data;
                    fetchCallback(new ProcessStatus(true, MessageText.FetchSuccessful));
                }.bind(this),
                failCallback = function () {
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
        createTimeEntries = function (entryCallback) {
            initServiceBase.call(this);
            var successCallback = function (status) {
                    if(status) {
                        entryCallback(new ProcessStatus(true, MessageText.TimeEntrySuccessful));
                    }
                    else {
                        entryCallback(new ProcessStatus(true, MessageText.TimeEntryFailure))
                    }
                }.bind(this),
                failCallback = function () {
                    entryCallback(new ProcessStatus(true, MessageText.TimeEntryFailure))
                }.bind(this);

            var updatedIssues = _.remove(this.ActiveIssues, function (entry) {
                return entry.updated;
            });
            this.serviceBase.createTimeEntries(updatedIssues, successCallback, failCallback);
        };

    return {
        setSettings: setSettings,
        fetchSettings: fetchSettings,
        fetchItems: fetchItems,
        filter: filter,
        addIssue: addIssue,
        updateTimeEntry: updateTimeEntry,
        fetchTimeEntryActivities: fetchTimeEntryActivities,
        getTimeEntryActivities: getTimeEntryActivities,
        createTimeEntries: createTimeEntries
    };
}());

module.exports = StoreHelper;
