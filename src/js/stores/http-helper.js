var InvalidArgumentError = require("../error/InvalidArgumentError"),
    $ = require("jquery"),
    Validator = require("validator");

var HttpHelper = function (apiKey) {
    "use strict";
    if(typeof apiKey !== "string" || apiKey === "") {
        throw new InvalidArgumentError("Parameter apiKey must be a none empty string.");
    }

    this.apiKey = apiKey;
};

HttpHelper.prototype = (function () {
    "use strict";
    var getRequest = function (url) {
            if(!Validator.isURL(url)){
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
            if(!Validator.isURL(url)){
                throw new InvalidArgumentError("Parameter url must be a URL.");
            }

            if(typeof data !== "object"){
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
        };
    return {
        getRequest: getRequest,
        postRequest: postRequest
    };
}());

HttpHelper.createInstance = function (apiKey) {
    return new HttpHelper(apiKey);
};

module.exports = HttpHelper;
