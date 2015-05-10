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
    this.timePostedTaskCollection = [];
    this.resultCount = 10;
};

DataManager.prototype = (function () {
    var colourCollection = [
            '#FFCDD2',
            '#E1BEE7',
            '#D1C4E9',
            '#BBDEFB',
            '#B2EbF2',
            '#C8E6E9',
            '#F0F4C3',
            '#FFF9C4',
            '#FFCCBC'
        ],
        fetchData = function (taskAssignee) {
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
        fetchLatest = function (taskAssignee) {
            var deferred = $.Deferred();
            $.when(this.serviceAccessor.getTaskCollection(taskAssignee, false)).done(function (taskCollection) {
                taskCollection.map(function (task) {
                    var taskIndex = _.findIndex(this.taskCollection, { 'id' : task.id });
                    if(typeof taskIndex === "number") {
                        this.taskCollection[taskIndex] = task;
                        var oldActiveTask = _.filter(this.activeTaskCollection, { 'issueId' : task.id });
                        if(oldActiveTask.length > 0) {
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
                    task.formattedTitle =  task.formattedTitle.replace(queryPartSelectors[i], getTextHighlighter.call(this, i));
                }
            });

            return sortedList;
        },
        getTextHighlighter = function (index) {
            debugger;
            var length = colourCollection.length,
                colourIndex = index/length>=1?index%length:index;

            return "<span style=\"background-color:" + colourCollection[colourIndex] + ";font-weight: bold;\">$1</span>";
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
        updateActiveTask = function (timeEntryId, hours, activityId, comments, timeEntryDate) {
            var entry = _.find(this.activeTaskCollection, { 'id': timeEntryId });
            entry.updateEntry(timeEntryDate, parseInt(hours), activityId, comments);
        },
        postUpdatedActiveTaskCollection = function () {
            var deferred = $.Deferred();
            this.timePostedTaskCollection = _.remove(this.activeTaskCollection, function (entry) {
                return entry.updated;
            });
            $.when(this.serviceAccessor.createTimeEntries(this.timePostedTaskCollection)).done(function () {
                deferred.resolve();
            }.bind(this)).fail(function () {
                deferred.reject("Time entry failure.");
            }.bind(this));
            return deferred.promise();
        };
    return {
        fetchData: fetchData,
        fetchLatest: fetchLatest,
        filterTaskCollection: filterTaskCollection,
        createActiveTask: createActiveTask,
        updateActiveTask: updateActiveTask,
        postUpdatedActiveTaskCollection: postUpdatedActiveTaskCollection,
        removeActiveTask: removeActiveTask
    }
})();

module.exports = DataManager;