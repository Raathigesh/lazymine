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

            localStorage.setItem(this.settingsKey, settings);
            this.settings = settings;

            return new ProcessStatus(true, MessageText.SaveSuccessful);
        },
        getSettings = function () {
            var settings = localStorage.getItem(this.settingsKey);
            if (settings) {
                return settings;
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
            var fetchSettingsProcess = fetchSettings.call(this);
            if (!fetchSettingsProcess.status) {
                fetchCallback(fetchSettingsProcess);
            }

            initServiceBase.call(this);
            var successCallbackHandler = function (data) {
                    this.AllIssues = $.makeArray(data);
                    fetchCallback(new ProcessStatus(true, MessageText.FetchSuccessful));
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

            var upperQuery = query.toUpperCase(),
                filterItems = Lodash.filter(this.AllIssues, function (item) {
                    return item.subject.toUpperCase().indexOf(upperQuery) !== -1;
                }),
                filterItemsClone = Lodash.cloneDeep(filterItems);

            filterItemsClone.map(function (item) {
                item.formattedTitle = formatFilter.call(this, item.subject, upperQuery);
            });

            return new ProcessStatus(true, MessageText.IssueFilterSuccessful, filterItemsClone);
        },
        addIssue = function (id) {
            var issue = Lodash.find(this.AllIssues, function (item) {
                    return item.id === id;
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
        createTimeEntries = function (entryCallback) {
            initServiceBase.call(this);
            var successCallback = function (data) {
                    entryCallback(new ProcessStatus(true, MessageText.TimeEntrySuccessful))
                }.bind(this),
                failCallback = function (jqXHR, textStatus, errorThrown) {
                    entryCallback(new ProcessStatus(true, MessageText.TimeEntryFailure))
                }.bind(this);
            this.serviceBase.createTimeEntries(issues, successCallback, failCallback);
        };

    return {
        setSettings: setSettings,
        getSettings: getSettings,
        fetchItems: fetchItems,
        filter: filter,
        addIssue: addIssue,
        fetchTimeEntryActivities: fetchTimeEntryActivities,
        getTimeEntryActivities: getTimeEntryActivities,
        createTimeEntries: createTimeEntries
    };
}());

module.exports = StoreHelper;
