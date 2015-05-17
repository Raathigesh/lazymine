/*global require, module, localStorage*/
var Validator = require('validator'),
    InvalidArgumentError = require('../error/invalid-argument-error'),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    TaskAssignee = require('../constants/task-assignee'),
    objectHelper = require('./object-helper'),
    StoreError = require('../constants/store-errors'),
    $ = require('jquery'),
    moment = require('moment');

var SettingsManager = function () {
    "use strict";
    this.settingsKey = "login_credentials";
    this.taskCollectionKey = "task_collection";

    this.BaseURL = "";
    this.APIKey = "";
    this.TaskAssignee = TaskAssignee.All;
    this.timeEntryDay = moment();
    this.timeEntryCollection = [];
    this.available  = this.fetchSettings();
    this.forceLoad = false;
    this.backgroundFetchTimerInterval = 900000;
};

SettingsManager.prototype = (function () {
    "use strict";
    var setTaskCollection = function (timeEntryCollection) {
            if (typeof timeEntryCollection === "Array") {
                throw new InvalidArgumentError("Parameter timeEntryCollection must be an array.");
            }

            localStorage.setItem(this.taskCollectionKey, JSON.stringify(timeEntryCollection));
            this.timeEntryCollection = timeEntryCollection;
        },
        fetchTaskCollection = function () {
            var timeEntryCollectionJson = localStorage.getItem(this.taskCollectionKey);
            if (timeEntryCollectionJson) {
                this.timeEntryCollection = JSON.parse(timeEntryCollectionJson);
                return true;
            }

            return false;
        },
        validateSettings = function (settings) {
            var deferred = $.Deferred(),
                currentUserDetailUrl = UrlBuilder.createInstance(settings.BaseURL).buildCurrentUserUrl();
            $.when(HttpHelper.createInstance(settings.APIKey).getRequest(currentUserDetailUrl)).done(function (data) {
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        setSettings = function (baseUrl, apiKey, assignee) {
            var deferred = $.Deferred(),
                settings = {
                    BaseURL: baseUrl,
                    APIKey: apiKey,
                    TaskAssignee: assignee
                };

            if (!Validator.isURL(baseUrl)) {
                deferred.reject(StoreError.InvalidUrl);
                return deferred.promise();
            }

            if (typeof apiKey !== "string" || apiKey === "") {
                deferred.reject(StoreError.InvalidApiKey);
                return deferred.promise();
            }

            if (!objectHelper.hasPropertyValue(TaskAssignee, assignee)) {
                deferred.reject("Parameter assignee must be an instance of taskAssignee.");
                return deferred.promise();
            }

            $.when(validateSettings.call(this, settings)).done(function () {
                localStorage.setItem(this.settingsKey, JSON.stringify(settings));
                this.BaseURL = baseUrl;
                this.APIKey = apiKey;
                this.TaskAssignee = assignee;
                this.available = true;
                this.forceLoad = true;
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject(StoreError.UrlOrApiKeyInvalid);
            }.bind(this));
            return deferred.promise();
        },
        fetchSettings = function () {
            var storeSettings = localStorage.getItem(this.settingsKey),
                settings;
            if (storeSettings) {
                settings = JSON.parse(storeSettings);
                this.BaseURL = settings.BaseURL;
                this.APIKey = settings.APIKey;
                this.TaskAssignee = settings.TaskAssignee;
                return true;
            }
            return false;
        },
        getTimeEntryDay = function () {
            return this.timeEntryDay.format("YYYY-MM-DD");
        },
        setTimeEntryDay = function (timeEntryDate) {
            if (timeEntryDate._isAMomentObject === true) {
                throw new InvalidArgumentError("Parameter timeEntryDate must be a moment object.");
            }

            this.timeEntryDay = timeEntryDate;
        };
    return {
        setSettings: setSettings,
        fetchSettings: fetchSettings,
        getTimeEntryDay: getTimeEntryDay,
        setTimeEntryDay: setTimeEntryDay,
        setTaskCollection: setTaskCollection,
        fetchTaskCollection: fetchTaskCollection
    };
}());

module.exports = new SettingsManager();