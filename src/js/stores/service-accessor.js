var httpHelper = require('./http-Helper.js');
var UrlBuilder = require('./url-builder.js');

var ServiceAccessor = function (serviceBaseUrl, apiKey) {
    "use strict";
    this.serviceBaseUrl = serviceBaseUrl;
    this.apiKey = apiKey;
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var getIssuesDoneCallbackHandler = function (data) {
            console.log(data);
            var totalItemCount = data.total_count,
                currentPage = data.offset,
                pageSize = data.limit,
                issues = data.issues;
        },
        getFailCallbackHandler = function (jqXHR, textStatus, errorThrown) {
            debugger;
        },
        getAllIssues = function (issueCallback) {
            debugger;
            issueCallbackHolder = issueCallback;
            var urlBuilder = new UrlBuilder(this.serviceBaseUrl, 100, 1),
                issuesUrl = urlBuilder.buildIssuesUrl();
        
            httpHelper.getRequet(issuesUrl, getFailCallbackHandler, getIssuesDoneCallbackHandler);
        };
    return {
        getAllIssues: getAllIssues
    };
}());

module.exports = ServiceAccessor;

