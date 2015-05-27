/*global require, module*/
var InvalidArgumentError = require("../error/invalid-argument-error"),
    InvalidOperationError = require("../error/invalid-operation-error"),
    ServiceAccessor = require('./service-accessor'),
    TimeEntry = require('./time-entry'),
    $ = require("jquery"),
    _ = require('lodash'),
    moment = require('moment'),
    Validator = require('validator'),
    StoreError = require('../constants/store-errors'),
    FilterType = {
        Match: "match",
        Equal: "equal"
    };

var DataManager = function (serviceAccessor) {
    "use strict";
    if (!(serviceAccessor instanceof ServiceAccessor)) {
        throw new InvalidArgumentError("Parameter serviceAccessor must be an instance of ServiceAccessor.");
    }

    this.serviceAccessor = serviceAccessor;

    this.taskCollection = [];
    this.activityCollection = [];
    this.activeTaskCollection = [];
    this.timePostedTaskCollection = null;
    this.resultCount = 10;
    this.urlFilterExpression = new RegExp("^" + this.serviceAccessor.serviceBaseUrl + "\\/issues\\/\\d{1,}$", 'gi');
    this.hashFilters = [
        {
            id: "#P",
            value: "project.name",
            filter: FilterType.Match
        },
        {
            id: "#ID",
            value: "id",
            filter: FilterType.Equal
        },
        {
            id: "#T",
            value: "tracker.name",
            filter: FilterType.Match
        },
        {
            id: "#A",
            value: "assigned_to.name",
            filter: FilterType.Match
        }
    ];
};

DataManager.prototype = (function () {
    "use strict";
    var getTaskUrl = function (id) {
            return this.serviceAccessor.serviceBaseUrl.concat("/issues/", id);
        },
        fetchData = function () {
            var promises = [],
                deferred = $.Deferred();
            promises.push(this.serviceAccessor.getTaskCollection(true));
            promises.push(this.serviceAccessor.getTimeEntryActivities());

            $.when.apply(this, promises).done(function (taskCollection, activityCollection) {
                this.taskCollection = taskCollection;
                this.activityCollection = activityCollection.time_entry_activities;
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject(StoreError.DataLoadFailure);
            }.bind(this));
            return deferred.promise();
        },
        fetchLatest = function () {
            var deferred = $.Deferred(),
                oldActiveTask;
            $.when(this.serviceAccessor.getTaskCollection(false)).done(function (taskCollection) {
                taskCollection.map(function (task) {
                    var taskIndex = _.findIndex(this.taskCollection, { 'id' : task.id });
                    if (typeof taskIndex === "number") {
                        this.taskCollection[taskIndex] = task;
                        oldActiveTask = _.filter(this.activeTaskCollection, { 'issueId' : task.id });
                        if (oldActiveTask.length > 0) {
                            oldActiveTask.map(function (activeTask) {
                                activeTask.issueName = task.subject;
                                activeTask.projectName = task.project.name;
                            });
                        }
                    } else {
                        this.taskCollection.push(task);
                    }
                }.bind(this));
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject(StoreError.DataLoadFailure);
            }.bind(this));
            return deferred.promise();
        },
        getHashProperty = function (value) {
            if (value) {
                return _.find(this.hashFilters, { 'id' : value });
            }

            return null;
        },
        applyMatchFilter = function (propertyName, query) {
            var hashFilterParts = query.toUpperCase().trim().split(' '),
                queryExpression = new RegExp("(?=.*" + hashFilterParts.join(')(?=.*') + ")", 'gi'),
                hashPropertyValue;
            return _.filter(this.taskCollection, function (task) {
                hashPropertyValue = _.get(task, propertyName);
                return (hashPropertyValue && hashPropertyValue.match(queryExpression));
            });
        },
        applyEqualFilter = function (propertyName, value) {
            if (!Validator.isInt(value)) {
                return [];
            }
            var parsedValue = parseInt(value, 10),
                task = _.find(this.taskCollection, function (task) {
                    var hashPropertyValue = _.get(task, propertyName);
                    return hashPropertyValue === parsedValue;
                });

            if (task) {
                return [ task ];
            }

            return [];
        },
        applySubjectFilter = function (taskCollection, queryParts) {
            var queryExpression = new RegExp("(?=.*" + queryParts.join(')(?=.*') + ")", 'gi'),
                match;
            return _.filter(taskCollection, function (task) {
                task.matchCount = 0;
                match = task.subject.match(queryExpression);
                if (match) {
                    task.matchCount += match.length;
                }

                return task.matchCount > 0;
            });
        },
        hashFilterTaskCollection = function (hashProperty, query) {
            switch (hashProperty.filter) {
            case FilterType.Match:
                return applyMatchFilter.call(this, hashProperty.value, query);
            case FilterType.Equal:
                return applyEqualFilter.call(this, hashProperty.value, query);
            }

        },
        applyUrlFilter = function (formattedQuery) {
            var match = formattedQuery.match(this.urlFilterExpression),
                filteredTasks;
            if (match) {
                filteredTasks = applyEqualFilter.call(this, "id", match[0].substr(match[0].lastIndexOf('/') + 1));
                filteredTasks.map(function (task) {
                    task.formattedTitle = task.subject;
                });

                return filteredTasks;
            }

            return [];
        },
        getTextHighlighter = function () {
            return "<span style=\"background-color:#81D4FA;font-weight: bold;\">$1</span>";
        },
        applyTitleHighlighter = function (taskCollection, upperQueryParts) {
            var selectorParts = _.filter(upperQueryParts, function (part) {
                    return part.length > 0;
                }),
                selectorExpression = new RegExp("(" + selectorParts.join('|') + ")", 'gi');
            taskCollection.map(function (task) {
                task.formattedTitle = task.subject;
                task.formattedTitle = task.formattedTitle.replace(selectorExpression, getTextHighlighter.call(this));
            });
        },
        filterTaskCollection = function (query) {
            var formattedQuery = _.trim(query.toUpperCase()),
                urlFilteredCollection = applyUrlFilter.call(this, formattedQuery),
                upperQueryParts,
                filterPartCount,
                hashProperty,
                taskCollection,
                parts,
                filteredTasks,
                sortedList;

            if (urlFilteredCollection.length === 1) {
                return urlFilteredCollection;
            }

            upperQueryParts = _.escapeRegExp(formattedQuery).split(' ');
            filterPartCount = upperQueryParts.length;

            if (filterPartCount === 0) {
                return [];
            }

            hashProperty = getHashProperty.call(this,  _.first(upperQueryParts));
            taskCollection = this.taskCollection;
            if (hashProperty) {
                if (filterPartCount < 2 || upperQueryParts[1].length === 0) {
                    return [];
                }

                taskCollection = hashFilterTaskCollection.call(this, hashProperty, upperQueryParts[1]);
                if (taskCollection.length === 0) {
                    return [];
                }

                upperQueryParts.splice(0, 2);
            }

            parts = _.filter(upperQueryParts, function (part) {
                return part.length > 1;
            });
            filteredTasks = applySubjectFilter.call(this, taskCollection, parts);

            if (filteredTasks.length === 0) {
                return [];
            }

            sortedList = _.take(_.sortByOrder(filteredTasks, ['matchCount'], [false]), this.resultCount);
            applyTitleHighlighter.call(this, sortedList, upperQueryParts);

            return sortedList;
        },
        createActiveTask = function (id) {
            var task = _.find(this.taskCollection, function (task) {
                return task.id === parseInt(id, 10);
            });

            if (!task) {
                throw new InvalidOperationError("Task not available.");
            }

            this.activeTaskCollection.push(TimeEntry.createInstance(task.id, task.subject, task.project.name, getTaskUrl.call(this, task.id)));
            this.activeTaskCollection = _.sortBy(this.activeTaskCollection, 'projectName');
        },
        removeActiveTask = function (timeEntryId) {
            _.remove(this.activeTaskCollection, function (entry) {
                return entry.id === timeEntryId;
            });
        },
        clearActiveTaskCollection = function () {
            this.activeTaskCollection = [];
        },
        updateActiveTaskHours = function (timeEntryId, hours) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.setHours(hours);
        },
        updateActiveTaskActivityId = function (timeEntryId, activityId) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.setActivityId(activityId);
        },
        updateActiveTaskComments = function (timeEntryId, comments) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.setComments(comments);
        },
        postUpdatedActiveTaskCollection = function (spentOn) {
            if (!spentOn || !spentOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter spentOn must be a moment object.");
            }

            var deferred = $.Deferred();
            this.timePostedTaskCollection = _.filter(this.activeTaskCollection, function (entry) {
                return entry.updated;
            });
            $.when(this.serviceAccessor.createTimeEntries(this.timePostedTaskCollection, spentOn)).done(function () {
                this.timePostedTaskCollection.map(function (timeEntry) {
                    timeEntry.clearTimeEntry();
                });
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject(StoreError.TimeEntryFailure);
            }.bind(this));
            return deferred.promise();
        },
        getPostedTaskCollection = function () {
            return _.pluck(this.timePostedTaskCollection, 'issueId');
        },
        getActiveTaskCollection = function () {
            return _.pluck(this.activeTaskCollection, 'issueId');
        },
        createActiveTaskCollection = function (taskIdCollection) {
            if (typeof taskIdCollection === "Array") {
                throw new InvalidArgumentError("Parameter taskIdCollection must be an array.");
            }

            taskIdCollection.map(function (taskId) {
                var task = _.find(this.taskCollection, function (task) {
                    return task.id === parseInt(taskId, 10);
                });

                if (!task) {
                    return;
                }

                this.activeTaskCollection.push(TimeEntry.createInstance(taskId, task.subject, task.project.name, getTaskUrl.call(this, task.id)));
            }.bind(this));

            this.activeTaskCollection = _.sortBy(this.activeTaskCollection, 'projectName');
        };
    return {
        fetchData: fetchData,
        fetchLatest: fetchLatest,
        filterTaskCollection: filterTaskCollection,
        createActiveTask: createActiveTask,
        updateActiveTaskHours: updateActiveTaskHours,
        updateActiveTaskActivityId: updateActiveTaskActivityId,
        updateActiveTaskComments: updateActiveTaskComments,
        postUpdatedActiveTaskCollection: postUpdatedActiveTaskCollection,
        removeActiveTask: removeActiveTask,
        clearActiveTaskCollection: clearActiveTaskCollection,
        getPostedTaskCollection: getPostedTaskCollection,
        getActiveTaskCollection: getActiveTaskCollection,
        createActiveTaskCollection: createActiveTaskCollection
    };
}());

module.exports = DataManager;