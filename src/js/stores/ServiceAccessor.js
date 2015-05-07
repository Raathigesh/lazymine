var InvalidArgumentError = require("../error/InvalidArgumentError"),
    ItemStatus = require("../constants/item-status"),
    HttpHelper = require('./HttpHelper'),
    UrlBuilder = require('./UrlBuilder'),
    TimeEntry = require('./TimeEntry'),
    $ = require("jquery"),
    Validator = require('validator');

var ServiceAccessor = function (serviceBaseUrl, httpHelper) {
    "use strict";
    if(!Validator.isURL(serviceBaseUrl)){
        throw new InvalidArgumentError("Parameter serviceBaseUrl must be a URL.");
    }

    if(!(httpHelper instanceof HttpHelper)) {
        throw new InvalidArgumentError("Parameter httpHelper must be an instance of HttpHelper.");
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
            if(typeof issueSuccessCallback !== "function") {
                throw new InvalidArgumentError("Parameter issueSuccessCallback must be a function.");
            }

            if(typeof issueFailCallback !== "function") {
                throw new InvalidArgumentError("Parameter issueFailCallback must be a function.");
            }

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
            if(typeof issueSuccessCallback !== "function") {
                throw new InvalidArgumentError("Parameter issueSuccessCallback must be a function.");
            }

            if(typeof issueFailCallback !== "function") {
                throw new InvalidArgumentError("Parameter issueFailCallback must be a function.");
            }

            var promises = [],
                issues = [],
                index,
                urlBuilder = UrlBuilder.createInstance(this.serviceBaseUrl),
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
        createTimeEntries = function (timeEntryCollection, timeEntrySuccessCallback, timeEntryFailCallback) {
            if(typeof timeEntrySuccessCallback !== "function") {
                throw new InvalidArgumentError("Parameter timeEntrySuccessCallback must be a function.");
            }

            if(typeof timeEntryFailCallback !== "function") {
                throw new InvalidArgumentError("Parameter timeEntryFailCallback must be a function.");
            }

            if(!(timeEntryCollection instanceof Array)) {
                throw new InvalidArgumentError("Parameter timeEntryCollection must be an array.");
            }

            var promises = [],
                timeEntryUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildTimeEntryUrl();

            timeEntryCollection.map(function (timeEntry) {
                if(!(timeEntry instanceof TimeEntry)) {
                    throw new InvalidArgumentError("Parameter timeEntryCollection must contain TimeEntry objects.");
                }

                promises.push(this.httpHelper.postRequest(timeEntryUrl, timeEntry.buildPostEntry()));
            }.bind(this));

            $.when.apply($, promises).done(function () {
                timeEntrySuccessCallback(true);
            }.bind(this)).fail(function () {
                timeEntryFailCallback();
            }.bind(this));
        },
        getTimeEntryActivities = function (activitySuccessCallback, activityFailCallback) {
            if(typeof activitySuccessCallback !== "function") {
                throw new InvalidArgumentError("Parameter activitySuccessCallback must be a function.");
            }

            if(typeof activityFailCallback !== "function") {
                throw new InvalidArgumentError("Parameter activityFailCallback must be a function.");
            }

            var TimeEntryActivitiesUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildTimeEntryActivitiesUrl();
            $.when(this.httpHelper.getRequest(TimeEntryActivitiesUrl)).done(function (response) {
                activitySuccessCallback(response);
            }.bind(this)).fail(function () {
                activityFailCallback();
            }.bind(this));
        };
    return {
        getAllIssues: getAllIssues,
        getIssues: getIssues,
        createTimeEntries: createTimeEntries,
        getTimeEntryActivities: getTimeEntryActivities
    };
}());

ServiceAccessor.createInstance = function (serviceBaseUrl, httpHelper) {
    return new ServiceAccessor(serviceBaseUrl, httpHelper);
};

module.exports = ServiceAccessor;
