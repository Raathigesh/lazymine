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
        getTimeEntryUrl = function (timeEntryId) {
            return this.serviceAccessor.serviceBaseUrl.concat('/time_entries/' + timeEntryId +'/edit');
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
                    if (taskIndex >= 0) {
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

            sortedList = _.take(_.sortByOrder(filteredTasks, ['matchCount', 'created_on', 'updated_on'], [false, false, false]), this.resultCount);
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

            this.activeTaskCollection.unshift(TimeEntry.createInstance(task.id, task.subject, task.project.name, getTaskUrl.call(this, task.id)));
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
        updateActiveTaskCustomField = function (timeEntryId, customFieldId, customFieldValue) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.setCustomField(customFieldId, customFieldValue);
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

            if (this.timePostedTaskCollection.length === 0) {
                deferred.reject(StoreError.NoTimeEntryAvailable);
            }

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

            taskIdCollection.map(function (entry) {
                var task = _.find(this.taskCollection, { "id" :  entry.issueId});

                if (!task) {
                    return;
                }

                entry.issueName = task.subject;
                entry.projectName = task.project.name;
                var timeEntry = TimeEntry.createInstance(task.id, task.subject, task.project.name, getTaskUrl.call(this, task.id));
                timeEntry.spentOn = entry.spentOn;
                timeEntry.hours = entry.hours;
                timeEntry.activityId = entry.activityId;
                timeEntry.comments = entry.comments;
                timeEntry.updated = entry.updated;
                timeEntry.customFields = entry.customFields;
                this.activeTaskCollection.push(timeEntry);
            }.bind(this));
        },
        populateNames = function (timeEntryCollection) {
            $.each(timeEntryCollection, function (index, timeEntry) {
                var taskEntry = _.find(this.taskCollection, { "id" :  timeEntry.issue.id });
                if(taskEntry) {
                    timeEntry.subject = taskEntry.subject;
                    timeEntry.project = taskEntry.project.name;
                    timeEntry.timeEntryUrl = getTimeEntryUrl.call(this, timeEntry.id);
                } else { // TODO: get task detail by sending a request.
                    timeEntry.subject = timeEntry.issue.id;
                    timeEntry.timeEntryUrl = getTimeEntryUrl.call(this, timeEntry.id);
                }
            }.bind(this));

            return timeEntryCollection;
        },
        getTimeEntryRange = function(spentOn, noOfDays) {            
            var firstDay = spentOn.weekday(0);
            var deferred = $.Deferred(),
                promises = [];
            for (var i = 0; i < noOfDays; i++) {
                var day  = firstDay.clone().day(i);
                promises.push(this.serviceAccessor.getTimeEntries(day));
            }

            $.when.apply($, promises).done(function () {
                var data = [],
                    count = 0;

                for (var i = 0; i < noOfDays; i++) {
                    var day  = firstDay.clone().day(i);   
                    data.push({
                        day: day,
                        data: populateNames.call(this, arguments[count].time_entries)
                    });

                    count++;
                }
                deferred.resolve(data);
            }.bind(this)).fail(function () {
                deferred.reject();
            }.bind(this));

            return deferred.promise();
        };
    return {
        fetchData: fetchData,
        fetchLatest: fetchLatest,
        filterTaskCollection: filterTaskCollection,
        createActiveTask: createActiveTask,
        updateActiveTaskHours: updateActiveTaskHours,
        updateActiveTaskCustomField: updateActiveTaskCustomField,
        updateActiveTaskActivityId: updateActiveTaskActivityId,
        updateActiveTaskComments: updateActiveTaskComments,
        postUpdatedActiveTaskCollection: postUpdatedActiveTaskCollection,
        removeActiveTask: removeActiveTask,
        clearActiveTaskCollection: clearActiveTaskCollection,
        getPostedTaskCollection: getPostedTaskCollection,
        getActiveTaskCollection: getActiveTaskCollection,
        createActiveTaskCollection: createActiveTaskCollection,
        getTimeEntryRange: getTimeEntryRange
    };
}());

module.exports = DataManager;