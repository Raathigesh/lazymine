var Validator = require("validator"),
    InvalidArgumentError = require("../error/invalid-argument-error"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    TaskAssignee = require("../constants/task-assignee"),
    TimeEntryDay = require("../constants/time-entry-day"),
    objectHelper = require("./object-helper"),
    $ = require("jquery");

var SettingsManager = function () {
    "use strict";
    this.settingsKey = "settings";

    this.BaseURL = "";
    this.APIKey = "";
    this.TaskAssignee = TaskAssignee.All;
    this.TimeEntryDay = TimeEntryDay.Today;
    this.available  = this.fetchSettings();
};

SettingsManager.prototype = (function () {
    "use strict";
    var setSettings = function (baseUrl, apiKey, assignee) {
            var deferred = $.Deferred();
            if(!Validator.isURL(baseUrl)){
                deferred.reject("Parameter baseUrl must be valid.");
                return deferred.promise();
            }

            if (typeof apiKey !== "string" || apiKey === "") {
                deferred.reject("Parameter apiKey must not be empty.");
                return deferred.promise();
            }

            if (!objectHelper.hasPropertyValue(TaskAssignee, assignee)) {
                deferred.reject("Parameter assignee must be an instance of taskAssignee.");
                return deferred.promise();
            }

            var settings = {
                BaseURL: baseUrl,
                APIKey: apiKey,
                TaskAssignee: assignee
            };

            $.when(validateSettings.call(this, settings)).done(function () {
                localStorage.setItem(this.settingsKey, JSON.stringify(settings));
                this.BaseURL = baseUrl;
                this.APIKey = apiKey;
                this.TaskAssignee = assignee;
                this.available = true;
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject("URL or API key is invalid.");
            }.bind(this));
            return deferred.promise();
        },
        validateSettings = function (settings) {
            var deferred = $.Deferred();
            var currentUserDetailUrl = UrlBuilder.createInstance(settings.BaseURL).buildCurrentUserUrl();
            $.when(HttpHelper.createInstance(settings.APIKey).getRequest(currentUserDetailUrl)).done(function (data) {
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        fetchSettings = function () {
            var storeSettings = localStorage.getItem(this.settingsKey);
            if (storeSettings) {
                var settings = JSON.parse(storeSettings);
                this.BaseURL = settings.BaseURL;
                this.APIKey = settings.APIKey;
                this.TaskAssignee = settings.TaskAssignee;
                return true;
            }
            return false;
        };
    return {
        setSettings: setSettings,
        fetchSettings: fetchSettings
    };
})();

module.exports = new SettingsManager();