var InvalidArgumentError = require("../error/invalid-argument-error"),
    ItemStatus = require("../constants/item-status"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    TimeEntry = require('./time-entry'),
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
    this.taskStatusCollection = [
        ItemStatus.InProgress,
        ItemStatus.New,
        ItemStatus.ReOpened
    ];
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var getTaskCollectionPromises = function () {
            var promises = [];
            this.taskStatusCollection.map(function (taskStatus) {
                var deferred = $.Deferred();
                $.when(getTaskCollectionWithStatus.call(this, taskStatus)).done(function (data) {
                    deferred.resolve(data);
                }.bind(this)).fail(function () {
                    deferred.reject();
                }.bind(this));
                promises.push(deferred.promise());
            }.bind(this));
            return promises;
        },
        getTaskCollection = function () {
            var deferred = $.Deferred();
            $.when.apply(this, getTaskCollectionPromises.call(this)).done(function () {
                var taskCollection = [];
                for (var index = 0; index < arguments.length; index = index + 1) {
                    taskCollection = taskCollection.concat(arguments[index])
                }
                deferred.resolve(taskCollection);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        getTaskCollectionWithStatus = function (taskStatus) {
            var deferred = $.Deferred();
            var promises = [],
                taskCollection = [],
                index,
                urlBuilder = UrlBuilder.createInstance(this.serviceBaseUrl),
                issuesUrl = urlBuilder.withItemStatus(taskStatus).buildIssuesUrl();

            $.when(this.httpHelper.getRequest(issuesUrl)).done(function (data) {
                var totalRows = data.total_count,
                    totalPageCount = Math.ceil(totalRows / urlBuilder.getPageSize());

                taskCollection = taskCollection.concat(data.issues);
                if (totalPageCount > 1) {
                    for (index = 2; index <= totalPageCount; index = index + 1) {
                        issuesUrl = urlBuilder.withNextOffset().buildIssuesUrl();
                        promises.push(this.httpHelper.getRequest(issuesUrl));
                    }

                    $.when.apply($, promises).done(function () {
                        for (index = 0; index < arguments.length; index = index + 1) {
                            taskCollection = taskCollection.concat(arguments[index][0].issues)
                        }

                        deferred.resolve(taskCollection);
                    }.bind(this)).fail(function () {
                        deferred.reject();
                    }.bind(this));
                } else {
                    deferred.resolve(taskCollection);
                }
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        createTimeEntries = function (timeEntryCollection) {
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

            var deferred = $.Deferred();
            $.when.apply($, promises).done(function () {
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        getTimeEntryActivities = function () {
            var deferred = $.Deferred();
            var TimeEntryActivitiesUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildTimeEntryActivitiesUrl();
            $.when(this.httpHelper.getRequest(TimeEntryActivitiesUrl)).done(function (data) {
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        };
    return {
        getTaskCollection: getTaskCollection,
        getTaskCollectionWithStatus: getTaskCollectionWithStatus,
        createTimeEntries: createTimeEntries,
        getTimeEntryActivities: getTimeEntryActivities
    };
}());

ServiceAccessor.createInstance = function (serviceBaseUrl, httpHelper) {
    return new ServiceAccessor(serviceBaseUrl, httpHelper);
};

module.exports = ServiceAccessor;
