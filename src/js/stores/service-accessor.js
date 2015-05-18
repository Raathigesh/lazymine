/*global require, module*/
var InvalidArgumentError = require("../error/invalid-argument-error"),
    InvalidOperationError = require("../error/invalid-operation-error"),
    ItemStatus = require("../constants/item-status"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    TimeEntry = require('./time-entry'),
    $ = require("jquery"),
    moment = require('moment'),
    Validator = require('validator');

var ServiceAccessor = function (serviceBaseUrl, httpHelper) {
    "use strict";
    if (!Validator.isURL(serviceBaseUrl)) {
        throw new InvalidArgumentError("Parameter serviceBaseUrl must be a URL.");
    }

    if (!(httpHelper instanceof HttpHelper)) {
        throw new InvalidArgumentError("Parameter httpHelper must be an instance of HttpHelper.");
    }

    this.serviceBaseUrl = serviceBaseUrl;
    this.httpHelper = httpHelper;
    this.taskStatusCollection = [
        ItemStatus.InProgress,
        ItemStatus.New,
        ItemStatus.ReOpened,
        ItemStatus.Sandbox
    ];
    this.lastTaskFetch = null;
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var getTaskCollectionWithStatus = function (urlBuilder) {
            var deferred = $.Deferred(),
                promises = [],
                taskCollection = [],
                index,
                issuesUrl = urlBuilder.buildIssuesUrl();

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
                            taskCollection = taskCollection.concat(arguments[index][0].issues);
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
        getTaskPromise = function (taskUrlBuilder) {
            var deferred = $.Deferred();
            $.when(getTaskCollectionWithStatus.call(this, taskUrlBuilder)).done(function (data) {
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        getTaskCollectionPromises = function (isFullFetch) {
            var promises = [];
            this.taskStatusCollection.map(function (taskStatus) {
                var urlBuilder = UrlBuilder.createInstance(this.serviceBaseUrl);
                if (isFullFetch) {
                    urlBuilder.withItemStatus(taskStatus);
                } else {
                    urlBuilder.withItemStatus(taskStatus)
                        .withUpdatedOn(this.lastTaskFetch);
                }
                promises.push(getTaskPromise.call(this, urlBuilder));
            }.bind(this));
            return promises;
        },
        getTaskCollection = function (isFullFetch) {
            if (typeof isFullFetch !== "boolean") {
                throw new InvalidArgumentError("Parameter isFullFetch must be a boolean.");
            }

            var deferred = $.Deferred();
            $.when.apply(this, getTaskCollectionPromises.call(this, isFullFetch)).done(function () {
                var taskCollection = [],
                    index = 0,
                    length = arguments.length;

                for (index; index < length; index = index + 1) {
                    taskCollection = taskCollection.concat(arguments[index]);
                }

                this.lastTaskFetch = moment();
                deferred.resolve(taskCollection);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        createTimeEntries = function (timeEntryCollection, spentOn) {
            if (!(timeEntryCollection instanceof Array)) {
                throw new InvalidArgumentError("Parameter timeEntryCollection must be an array.");
            }

            if (!spentOn || !spentOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter spentOn must be a moment object.");
            }

            var promises = [],
                timeEntryUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildTimeEntryUrl(),
                deferred = $.Deferred();

            timeEntryCollection.map(function (timeEntry) {
                if (!(timeEntry instanceof TimeEntry)) {
                    throw new InvalidArgumentError("Parameter timeEntryCollection must contain TimeEntry objects.");
                }

                promises.push(this.httpHelper.postRequest(timeEntryUrl, timeEntry.setSpentOn(spentOn).buildPostEntry()));
            }.bind(this));

            $.when.apply($, promises).done(function () {
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        getTimeEntryActivities = function () {
            var deferred = $.Deferred(),
                timeEntryActivitiesUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildTimeEntryActivitiesUrl();
            $.when(this.httpHelper.getRequest(timeEntryActivitiesUrl)).done(function (data) {
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));
            return deferred.promise();
        },
        getTimeEntries = function (spentOn) {
            var deferred = $.Deferred(),
                updatedTimeEntriesUrl = UrlBuilder.createInstance(this.serviceBaseUrl).buildUpdatedTimeEntriesUrl(spentOn);
            $.when(this.httpHelper.getRequest(updatedTimeEntriesUrl)).done(function (data) {
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
        getTimeEntryActivities: getTimeEntryActivities,
        getTimeEntries: getTimeEntries
    };
}());

ServiceAccessor.createInstance = function (serviceBaseUrl, httpHelper) {
    "use strict";
    return new ServiceAccessor(serviceBaseUrl, httpHelper);
};

module.exports = ServiceAccessor;
