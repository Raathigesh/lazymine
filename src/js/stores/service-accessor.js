var InvalidArgumentError = require("../error/InvalidArgumentError"),
    ItemStatus = require("../constants/item-status"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    $ = require("jquery"),
    _ = require('lodash');

var ServiceAccessor = function (serviceBaseUrl, httpHelper) {
    "use strict";
    if(!(httpHelper instanceof HttpHelper)) {
        throw new InvalidArgumentError("Parameter httpHelper must be instance of HttpHelper");
    }

    this.serviceBaseUrl = serviceBaseUrl;
    this.httpHelper = httpHelper;
    this.itemStatusCollection = [
        ItemStatus.InProgress,
        ItemStatus.New,
        ItemStatus.ReOpened
    ];
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var getIssuePromises = function () {
            var promises = [];
            this.itemStatusCollection.map(function (itemStatus) {
                var deferred = $.Deferred();
                getIssues.call(this, itemStatus, function (data) {
                    deferred.resolve(data);
                }, function () {
                    deferred.reject();
                });
                promises.push(deferred.promise());
            }.bind(this));
            return promises;
        },
        getAllIssues = function (issueSuccessCallback, issueFailCallback) {
            $.when.apply(this, getIssuePromises.call(this)).done(function () {
                var issues = [];
                for (var index = 0; index < arguments.length; index = index + 1) {
                    issues = issues.concat(arguments[index])
                }
                issueSuccessCallback(issues);
            }.bind(this)).fail(function () {
                issueFailCallback()
            }.bind(this));
        },
        getIssues = function (itemStatus, issueSuccessCallback, issueFailCallback) {
            var promises = [],
                issues = [],
                index,
                urlBuilder = new UrlBuilder(this.serviceBaseUrl),
                issuesUrl = urlBuilder.withItemStatus(itemStatus).buildIssuesUrl();

            $.when(this.httpHelper.getRequest(issuesUrl)).done(function (data) {
                var totalRows = data.total_count,
                    totalPageCount = Math.ceil(totalRows / urlBuilder.getPageSize());

                issues = issues.concat(data.issues);
                if (totalPageCount > 1) {
                    for (index = 2; index <= totalPageCount; index = index + 1) {
                        issuesUrl = urlBuilder.withNextOffset().buildIssuesUrl();
                        promises.push(this.httpHelper.getRequest(issuesUrl));
                    }

                    $.when.apply($, promises).done(function () {
                        for (index = 0; index < arguments.length; index = index + 1) {
                            issues = issues.concat(arguments[index][0].issues)
                        }

                        issueSuccessCallback(issues);
                    }.bind(this)).fail(function () {
                        issueFailCallback();
                    }.bind(this));
                } else {
                    issueSuccessCallback(issues);
                }
            }.bind(this)).fail(function () {
                issueFailCallback();
            }.bind(this));
        },
        createTimeEntries = function (issues, timeEntrySuccessCallback, timeEntryFailCallback) {
            var promises = [],
                timeEntryUrl = new UrlBuilder(this.serviceBaseUrl).buildTimeEntryUrl();

            for (var index = 0; index < issues.length; index = index + 1) {
                promises.push(this.httpHelper.postRequest(timeEntryUrl, issues[0]));
            }

            $.when.apply($, promises).done(function () {
                timeEntrySuccessCallback(true);
            }.bind(this)).fail(function () {
                timeEntryFailCallback();
            }.bind(this));
        },
        getTimeEntryActivities = function (activitySuccessCallback, activityFailCallback) {
            var TimeEntryActivitiesUrl = new UrlBuilder(this.serviceBaseUrl).buildTimeEntryActivitiesUrl();
            $.when(this.httpHelper.getRequest(TimeEntryActivitiesUrl)).done(function (response) {
                activitySuccessCallback(response);
            }.bind(this)).fail(function () {
                activityFailCallback();
            }.bind(this));
        };
    return {
        getAllIssues: getAllIssues,
        createTimeEntries: createTimeEntries,
        getTimeEntryActivities: getTimeEntryActivities
    };
}());

module.exports = ServiceAccessor;
