var httpHelper = require('./http-Helper.js');
var UrlBuilder = require('./url-builder.js');

var ServiceAccessor = function (serviceBaseUrl, apiKey) {
    "use strict";
    this.serviceBaseUrl = serviceBaseUrl;
    this.apiKey = apiKey;
    this.pageSize  = 100.0;
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var issues = [],
        getAllIssues = function (issueSuccessCallback, issueFailCallback) {
            var urlBuilder = new UrlBuilder(this.serviceBaseUrl)
                                    .withPageSize(this.pageSize),
                promises = [],
                index,
                issuesUrl = urlBuilder.buildIssuesUrl();
        
            $.when(httpHelper.getRequet(this.apiKey, issuesUrl)).done(function (data) {
                var totalRows = data.total_count,
                    totalPageCount = Math.ceil(totalRows / this.pageSize);
                
                issues = data.issues;
                if (totalPageCount > 1) {
                    for (index = 2; index <= totalPageCount; index = index + 1) {
                        issuesUrl = urlBuilder.withNextOffset().buildIssuesUrl();
                        promises.push(httpHelper.getRequet(this.apiKey, issuesUrl));
                    }
                    
                    $.when.apply($, promises).done(function () {
                        for (index = 0; index < arguments.length; index = index + 1) {
                            issues = issues.concat(arguments[index][0].issues);
                        }
                        
                        issueSuccessCallback(issues);
                    }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                        issueFailCallback(jqXHR, textStatus, errorThrown);
                    }.bind(this));
                } else {
                    issueSuccessCallback(issues);
                }
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                issueFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        };
    return {
        getAllIssues: getAllIssues
    };
}());

module.exports = ServiceAccessor;

