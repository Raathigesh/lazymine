var httpHelper = (function () {
    "use strict";
    var getRequet = function (apiKey, url) {
            return $.ajax({
                type: "GET",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true,
                headers: {
                    "X-Redmine-API-Key": "e0abd8e540c8fb88f10250405c0639309d7cf4b5"
                }
            });
        },
        postRequet = function (apiKey, url, data) {
            return $.ajax({
                type: "POST",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true,
                data: data,
                headers: {
                    "X-Redmine-API-Key": "e0abd8e540c8fb88f10250405c0639309d7cf4b5"
                }
            });
        };
    return {
        getRequet: getRequet,
        postRequet: postRequet
    };
}());

module.exports = httpHelper;