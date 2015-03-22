var httpHelper = (function () {
    "use strict";
    var getRequet = function (url, doneCallback, failCallback) {
            $.ajax({
                type: "GET",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true
            }).done(function (data) {
                doneCallback(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                failCallback(jqXHR, textStatus, errorThrown);
            });
        },
        postRequet = function (url, data, doneCallback, failCallback) {
            $.ajax({
                type: "POST",
                url: url,
                contentType : "application/json",
                crossDomain: true,
                dataType: 'jsonp',
                async: true,
                data: data
            }).done(function (data) {
                doneCallback(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                failCallback(jqXHR, textStatus, errorThrown);
            });
        };
    return {
        getRequet: getRequet,
        postRequet: postRequet
    };
}());

module.exports = httpHelper;