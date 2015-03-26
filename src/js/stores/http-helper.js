var httpHelper = (function () {
    "use strict";
    var getRequest = function (apiKey, url) {
            return $.ajax({
                type: "GET",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true,
                headers: {
                    "X-Redmine-API-Key": apiKey
                }
            });
        },
        postRequest = function (apiKey, url, data) {
            debugger; 
            return $.ajax({
                type: "POST",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true,
                data: JSON.stringify(data),
                headers: {
                    "X-Redmine-API-Key": apiKey
                }
            });
        };
    return {
        getRequest: getRequest,
        postRequest: postRequest
    };
}());

module.exports = httpHelper;