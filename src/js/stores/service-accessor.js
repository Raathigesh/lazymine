var httpHelper = require('./http-Helper');
var UrlBuilder = require('./url-builder');

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
            var promises = [],
                index,
                urlBuilder = new UrlBuilder(this.serviceBaseUrl)
                                    .withPageSize(this.pageSize),
                issuesUrl = urlBuilder.buildIssuesUrl();
        
            $.when(httpHelper.getRequest(this.apiKey, issuesUrl)).done(function (data) {
                var totalRows = data.total_count,
                    totalPageCount = Math.ceil(totalRows / this.pageSize);
                
                issues = data.issues;
                if (totalPageCount > 1) {
                    for (index = 2; index <= totalPageCount; index = index + 1) {
                        issuesUrl = urlBuilder.withNextOffset().buildIssuesUrl();
                        promises.push(httpHelper.getRequest(this.apiKey, issuesUrl));
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
        },
        createTimeEntries = function (issues, timeEntrySuccessCallback, timeEntryFailCallback) {
            var promises = [],
                index = 0,
                timeEntryUrl = new UrlBuilder(this.serviceBaseUrl).buildTimeEntryUrl();
                        
            for (index = 0; index < issues.length; index = index + 1) {
                promises.push(httpHelper.postRequest(this.apiKey, timeEntryUrl, issues[0]));
            }
            
            $.when.apply($, promises).done(function (data) {
                debugger;
                timeEntrySuccessCallback(true);
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                timeEntryFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        },
        getTimeEntryActivities = function (activitySuccessCallback, activityFailCallback) {
            var TimeEntryActivitiesUrl = new UrlBuilder(this.serviceBaseUrl).buildTimeEntryActivitiesUrl();
            $.when(httpHelper.getRequest(this.apiKey, TimeEntryActivitiesUrl)).done(function (response) {
                activitySuccessCallback(response);
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                activityFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        };
    return {
        getAllIssues: getAllIssues,
        createTimeEntries: createTimeEntries,
        getTimeEntryActivities: getTimeEntryActivities
    };
}());

module.exports = ServiceAccessor;

