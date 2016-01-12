/*global require, module*/
var InvalidArgumentError = require("../error/invalid-argument-error"),
    $ = require("jquery"),
    validator = require("validator");

var HttpHelper = function (apiKey) {
    "use strict";
    if (typeof apiKey !== "string" || apiKey === "") {
        throw new InvalidArgumentError("Parameter apiKey must be a none empty string.");
    }

    this.apiKey = apiKey;
};

HttpHelper.prototype = (function () {
    "use strict";
    var getRequest = function (url) {
            if (!validator.isURL(url)) {
                throw new InvalidArgumentError("Parameter url must be a URL.");
            }

            return $.ajax({
                type: "GET",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'json',
                async: true,
                headers: {
                    "X-Redmine-API-Key": this.apiKey
                }
            });
        },
        postRequest = function (url, data) {
            if (!validator.isURL(url)) {
                throw new InvalidArgumentError("Parameter url must be a URL.");
            }

            if (typeof data !== "object") {
                throw new InvalidArgumentError("Parameter data must be an object.");
            }

            return $.ajax({
                type: "POST",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'json',
                async: true,
                data: JSON.stringify(data),
                headers: {
                    "X-Redmine-API-Key": this.apiKey
                }
            });
        },
        deleteRequest = function (url) {
            if (!validator.isURL(url)) {
                throw new InvalidArgumentError("Parameter url must be a URL.");
            }

            return $.ajax({
                type: "DELETE",
                url: url,
                crossDomain: true,
                dataType: 'text',
                async: true,
                headers: {
                    "X-Redmine-API-Key": this.apiKey
                }
            });
        };
    return {
        getRequest: getRequest,
        postRequest: postRequest,
        deleteRequest: deleteRequest
    };
}());

HttpHelper.createInstance = function (apiKey) {
    "use strict";
    return new HttpHelper(apiKey);
};

module.exports = HttpHelper;
