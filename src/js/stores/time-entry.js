var InvalidArgumentError = require("../error/invalid-argument-error"),
    Guid = require("easy-guid");

TimeEntry = function (issueId, issueName, projectName) {
    if(typeof issueId !== "number") {
        throw new InvalidArgumentError("Parameter issueId must be a number.");
    }

    if(typeof issueName !== "string") {
        throw new InvalidArgumentError("Parameter issueName must be a string.");
    }

    if(typeof projectName !== "string") {
        throw new InvalidArgumentError("Parameter projectName must be a string.");
    }

    this.id = Guid.new();
    this.issueId = issueId;
    this.issueName = issueName;
    this.projectName = projectName;
    this.spentOn = null;
    this.hours = null;
    this.activityId = null;
    this.comments = null;
    this.updated = false;
};

TimeEntry.prototype = (function () {
    var dateFormatPattern = /^\d{4}-\d{2}-\d{2}$/,
        setSpentOn = function (spentOn) {
            if(typeof spentOn !== "string" || !spentOn.match(dateFormatPattern)) {
                throw new InvalidArgumentError("Parameter spentOn must be a string with format {YYYY-MM-DD}.");
            }

            this.spentOn = spentOn;
            return this;
        },
        updateEntry = function (hours, activityId, comments) {
            this.updated = false;
            if(typeof hours !== "number") {
                throw new InvalidArgumentError("Parameter hours must be a number.");
            }

            if(typeof hours > 0) {
                throw new InvalidArgumentError("Parameter hours cannot be a minus value.");
            }

            if(typeof activityId !== "number") {
                throw new InvalidArgumentError("Parameter activityId must be a number.");
            }

            if(typeof comments !== "string") {
                throw new InvalidArgumentError("Parameter comments must be a string.");
            }

            this.hours = hours;
            this.activityId = activityId;
            this.comments = comments;
            this.updated = true;
            return this;
        },
        buildPostEntry = function () {
            return {
                time_entry: {
                    issue_id: this.issueId,
                    spent_on: this.spentOn,
                    hours: this.hours,
                    activity_id: this.activityId,
                    comments: this.comments
                }
            };
        };
    return {
        updateEntry: updateEntry,
        buildPostEntry: buildPostEntry,
        setSpentOn: setSpentOn
    };
})();

TimeEntry.createInstance = function (issueId, issueName, projectName) {
    return new TimeEntry(issueId, issueName, projectName);
};

module.exports = TimeEntry;