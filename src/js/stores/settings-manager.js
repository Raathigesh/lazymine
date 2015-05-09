var Validator = require("validator"),
    InvalidArgumentError = require("../error/invalid-argument-error"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    $ = require("jquery");

var SettingsManager = function () {
    "use strict";
    this.settingsKey = "settings";

    this.BaseURL = "";
    this.APIKey = "";
    this.available  = this.fetchSettings();
};

SettingsManager.prototype = (function () {
    "use strict";
    var setSettings = function (baseUrl, apiKey) {
            var deferred = $.Deferred();
            if(!Validator.isURL(baseUrl)){
                deferred.reject("URL must be valid.");
                return deferred.promise();
            }

            if (typeof apiKey !== "string" || apiKey === "") {
                deferred.reject("API key must not be empty.");
                return deferred.promise();
            }

            var settings = {
                BaseURL: baseUrl,
                APIKey: apiKey
            };

            $.when(validateSettings.call(this, settings)).done(function () {
                localStorage.setItem(this.settingsKey, JSON.stringify(settings));
                this.BaseURL = baseUrl;
                this.APIKey = apiKey;
                this.available = true;
                deferred.resolve(data);
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