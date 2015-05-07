var Validator = require("validator"),
    InvalidArgumentError = require("../error/InvalidArgumentError");

var SettingsStore = function () {
    "use strict";
    this.BaseURL = null;
    this.APIKey = null;
};

SettingsStore.prototype = (function () {
    "use strict";
    var setSettings = function (baseUrl, apiKey) {
            if(!Validator.isURL(baseUrl)){
                throw new InvalidArgumentError("Parameter url must be a URL.");
            }

            if (typeof apiKey !== "string" || apiKey === "") {
                throw new InvalidArgumentError("Parameter apiKey must be a string.");
            }

            var settings = {
                baseUrl: baseUrl,
                apiKey: apiKey
            };
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            this.BaseURL = baseUrl;
            this.APIKey = apiKey;
        },
        validateSettings = function () {
            // TODO
        },
        fetchSettings = function () {
            var storeSettings = localStorage.getItem(this.settingsKey);
            if (storeSettings) {
                var settings = JSON.parse(storeSettings);
                this.BaseURL = settings.baseUrl;
                this.APIKey = settings.apiKey;
            }
        };
    return {
        setSettings: setSettings,
        validateSettings: validateSettings,
        fetchSettings: fetchSettings
    };
})();

module.exports = SettingsStore;