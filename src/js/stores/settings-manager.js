/*global require, module, localStorage, window*/
var Validator = require('validator'),
    InvalidArgumentError = require('../error/invalid-argument-error'),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    objectHelper = require('./object-helper'),
    StoreError = require('../constants/store-errors'),
    $ = require('jquery'),
    _ = require('lodash'),
    moment = require('moment');

var SettingsManager = function () {
    "use strict";
    this.AppVersion = "1.0.0";
    this.settingsKey = "login_credentials";
    this.taskCollectionKey = "task_collection";
    this.configKey = "configuration";

    this.BaseURL = "";
    this.APIKey = "";
    this.timeEntryDay = moment();
    this.activeTaskCollection = [];
    this.customFields = null;
    this.customFieldsVersion = null;
    this.timeEntryCustomFieldData = [];
    this.available  = this.fetchSettings();
    this.forceLoad = false;
    this.backgroundFetchTimerInterval = 300000;
    this.retryInterval = 10000;
};

SettingsManager.prototype = (function () {
    "use strict";
    var setTaskCollection = function (timeEntryCollection) {
            if (typeof timeEntryCollection === "Array") {
                throw new InvalidArgumentError("Parameter timeEntryCollection must be an array.");
            }

            localStorage.setItem(this.taskCollectionKey, JSON.stringify({
                version: this.AppVersion,
                value: timeEntryCollection
            }));
            this.activeTaskCollection = timeEntryCollection;
        },
        fetchTaskCollection = function () {
            var timeEntryCollectionJson = localStorage.getItem(this.taskCollectionKey);
            if (timeEntryCollectionJson) {
                var data = JSON.parse(timeEntryCollectionJson);
                if (data.version === this.customFieldsVersion) {
                    this.activeTaskCollection = data.value;
                    return true;
                } else {
                    return false;
                }
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
        clearSettings = function () {
            localStorage.removeItem(this.settingsKey);
            localStorage.removeItem(this.taskCollectionKey);
            this.BaseURL = "";
            this.APIKey = "";
            this.timeEntryDay = moment();
            this.activeTaskCollection = [];
            this.available  = false;
            this.forceLoad = false;
        },
        setSettings = function (baseUrl, apiKey) {
            var deferred = $.Deferred(),
                settings;

            if (!Validator.isURL(baseUrl)) {
                deferred.reject(StoreError.InvalidUrl);
                return deferred.promise();
            }

            if (typeof apiKey !== "string" || apiKey === "") {
                deferred.reject(StoreError.InvalidApiKey);
                return deferred.promise();
            }

            settings = {
                BaseURL: _.endsWith(_.trim(baseUrl), '/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl,
                APIKey: apiKey
            };

            $.when(validateSettings.call(this, settings)).done(function () {
                localStorage.setItem(this.settingsKey, JSON.stringify({
                    version: this.AppVersion,
                    value: settings
                }));
                this.BaseURL = settings.BaseURL;
                this.APIKey = apiKey;
                this.available = true;
                this.forceLoad = true;
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject(StoreError.UrlOrApiKeyInvalid);
            }.bind(this));
            return deferred.promise();
        },
        fetchSettings = function () {
            var config = JSON.parse(localStorage.getItem(this.configKey)),
                storeSettings = localStorage.getItem(this.settingsKey),
                data;

            try {
                this.customFieldsVersion = config.version;
                this.customFields = config.value;
                console.log(this.customFields);
                setTimeEntryCustomFieldData.call(this);
            } catch (error){
                this.customFields = [];
            }

            if (storeSettings) {
                data = JSON.parse(storeSettings);
                if (data.version === this.AppVersion) {
                    this.BaseURL = data.value.BaseURL;
                    this.APIKey = data.value.APIKey;
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        },
        setTimeEntryCustomFieldData = function () {
            this.customFields.map(function (field) {
                this.timeEntryCustomFieldData.push({
                    id: field.id,
                    required: field.required,
                    value: null
                })
            }.bind(this));
        };
    return {
        setSettings: setSettings,
        clearSettings: clearSettings,
        fetchSettings: fetchSettings,
        setTaskCollection: setTaskCollection,
        fetchTaskCollection: fetchTaskCollection
    };
}());

var instance = null;

module.exports = (function () {
    if( instance === null ) {
        instance = new SettingsManager();
    }

    return instance;
}(instance));