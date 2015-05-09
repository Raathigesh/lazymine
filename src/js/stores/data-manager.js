var InvalidArgumentError = require("../error/invalid-argument-error"),
    InvalidOperationError = require("../error/invalid-operation-error"),
    ServiceAccessor = require('./service-accessor'),
    TimeEntry = require('./time-entry'),
    $ = require("jquery"),
    _ = require('lodash'),
    moment = require('moment'),
    Validator = require('validator');

DataManager = function (serviceAccessor) {
    if(!(serviceAccessor instanceof ServiceAccessor)) {
        throw new InvalidArgumentError("Parameter serviceAccessor must be an instance of ServiceAccessor.");
    }

    this.serviceAccessor = serviceAccessor;

    this.taskCollection = [];
    this.activityCollection = [];
    this.activeTaskCollection = [];
    this.resultCount = 10;
    this.timeEntryDate = moment().format("YYYY-MM-DD");
};

DataManager.prototype = (function () {
    var fetchData = function (taskAssignee) {
            var promises = [];
            promises.push(this.serviceAccessor.getTaskCollection(taskAssignee, true));
            promises.push(this.serviceAccessor.getTimeEntryActivities());

            var deferred = $.Deferred();
            $.when.apply(this, promises).done(function (taskCollection, activityCollection) {
                this.taskCollection = taskCollection;
                this.activityCollection = activityCollection.time_entry_activities;
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject("Data load failure.");
            }.bind(this));
            return deferred.promise();
        },
        updateTaskList = function (taskAssignee) {
            var deferred = $.Deferred();
            $.when(this.serviceAccessor.getTaskCollection(taskAssignee, false)).done(function (taskCollection) {
                taskCollection.map(function (task) {
                    var oldTask = _.find(this.taskCollection, { 'id' : task.id });
                    if(oldTask) {
                        oldTask = task;
                    } else {
                        this.taskCollection.push(task);
                    }
                }.bind(this));
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject("Data load failure.");
            }.bind(this));
            return deferred.promise();
        },
        filterTaskCollection = function (query) {
            var upperQueryParts = query.toUpperCase().trim().split(' '),
                parts = _.filter(upperQueryParts, function(part) {
                    return part.length > 1;
                });

            var queryExpression = new RegExp("(?=.*" + parts.join(')(?=.*') + ")", 'gi');
            var filteredTasks= _.filter(this.taskCollection, function (task) {
                task.matchCount = 0;
                var match = task.subject.match(queryExpression);
                if(match)
                {
                    task.matchCount += match.length
                }

                return task.matchCount > 0;
            });

            var sortedList = _.take(_.sortByOrder(filteredTasks, ['matchCount'], [false]), this.resultCount);
            var queryPartSelectors = [];

            upperQueryParts.map(function (part) {
                if(part.length > 0) {
                    queryPartSelectors.push(new RegExp("(" + Validator.stripLow(part) + ")", 'gi'));
                }
            });

            sortedList.map(function (task) {
                task.formattedTitle = task.subject;
                for(var i = 0; i < upperQueryParts.length; i++) {
                    task.formattedTitle =  task.formattedTitle.replace(queryPartSelectors[i], "<b>$1</b>");
                }
            });

            return sortedList;
        },
        createActiveTask = function (id) {
            var task = _.find(this.taskCollection, function (task) {
                return task.id === parseInt(id);
            });

            if(!task) {
                throw new InvalidOperationError("Task not available.");
            }

            this.activeTaskCollection.push(TimeEntry.createInstance(task.id, task.subject, task.project.name));
        },
        removeActiveTask = function (timeEntryId) {
            _.remove(this.activeTaskCollection, function (entry) {
                return entry.id == timeEntryId;
            });
        },
        updateActiveTask = function (timeEntryId, hours, activityId, comments) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.updateEntry(this.timeEntryDate, parseInt(hours), activityId, comments);
        },
        postUpdatedActiveTaskCollection = function () {
            var deferred = $.Deferred(),
                updatedIssues = _.remove(this.activeTaskCollection, function (entry) {
                    return entry.updated;
                });
            $.when(this.serviceAccessor.createTimeEntries(updatedIssues)).done(function () {
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject("Time entry failure.");
            }.bind(this));
            return deferred.promise();
        };
    return {
        fetchData: fetchData,
        updateTaskList: updateTaskList,
        filterTaskCollection: filterTaskCollection,
        createActiveTask: createActiveTask,
        updateActiveTask: updateActiveTask,
        postUpdatedActiveTaskCollection: postUpdatedActiveTaskCollection,
        removeActiveTask: removeActiveTask
    }
})();

module.exports = DataManager;