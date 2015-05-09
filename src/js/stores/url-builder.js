var Validator = require("validator"),
    InvalidArgumentError = require("../error/invalid-argument-error"),
    ItemStatus = require("../constants/item-status"),
    TaskAssignee = require("../constants/task-assignee"),
    objectHelper = require("./object-helper"),
    moment = require('moment');

var UrlBase = {
    Issues : "/issues.json",
    TimeEntries: "/time_entries.json",
    TimeEntryActivities: "/enumerations/time_entry_activities.json",
    CurrentUser: "/users/current.json"
};

var UrlBuilder = function (serviceBaseUrl) {
    "use strict";
    if(!Validator.isURL(serviceBaseUrl)){
        throw new InvalidArgumentError("Parameter url must be a URL.");
    }

    this.serviceBaseUrl = serviceBaseUrl;
    this.statusId = ItemStatus.New;
    this.assignee = TaskAssignee.All;
    this.currentPageSize = 100;
    this.itemOffset = 0;
    this.createdOn = null;
    this.updatedOn = null;
};

UrlBuilder.prototype = (function () {
    "use strict";
    var withPageSize = function (pageSize) {
            if(typeof pageSize !== "number"){
                throw new InvalidArgumentError("Parameter pageSize must be a number.");
            }

            if(pageSize < 1 || pageSize > 100){
                throw new InvalidArgumentError("Parameter pageSize must be between 1 and 100.");
            }
            this.currentPageSize = pageSize;
            return this;
        },
        getPageSize = function(){
            return this.currentPageSize;
        },
        withOffset = function (offset) {
            if(typeof offset !== "number"){
                throw new InvalidArgumentError("Parameter offset must be a number.");
            }

            if(offset < 0){
                throw new InvalidArgumentError("Parameter offset must be greater than 0.");
            }

            this.itemOffset = offset;
            return this;
        },
        getOffset = function () {
            return this.itemOffset;
        },
        withTaskAssignee = function (taskAssignee) {
            this.assignee = taskAssignee;
            return this;
        },
        getTaskAssignee = function (){
            return this.assignee;
        },
        getTaskAssigneeUrlSegment = function (){
            return (this.assignee === TaskAssignee.All) ? "" : "&assigned_to_id=" + this.assignee;
        },
        withNextOffset = function () {
            this.itemOffset = this.itemOffset + this.currentPageSize;
            return this;
        },
        resetDefault = function () {
            this.itemOffset = 0;
            this.currentPageSize = 100;
            this.statusId = ItemStatus.New;
            return this;
        },
        withItemStatus = function (status) {
            if(!objectHelper.hasPropertyValue(ItemStatus, status)){
                throw new InvalidArgumentError("Parameter statusId must be a property of ItemStatus.");
            }

            this.statusId = status;
            return this;
        },
        getItemStatus = function () {
            return this.statusId;
        },
        withCreatedOn = function (createdOn) {
            this.createdOn = createdOn;
            return this;
        },
        withUpdatedOn = function (updatedOn) {
            this.updatedOn = updatedOn;
            return this;
        },
        getCreatedOnUrlSegment = function () {
            return this.createdOn ? "&created_on=><" + this.createdOn.format("YYYY-MM-DD") + "|" + moment().format("YYYY-MM-DD") : "";
        },
        getUpdatedOnUrlSegment = function () {
            return this.updatedOn ? "&updated_on=><" + this.updatedOn.format("YYYY-MM-DD") + "|" + moment().format("YYYY-MM-DD") : "";
        },
        buildIssuesUrl = function () {
            var assignedTo = getTaskAssigneeUrlSegment.call(this);
            var createdOn = getCreatedOnUrlSegment.call(this);
            var updatedOn = getUpdatedOnUrlSegment.call(this);
            return this.serviceBaseUrl.concat(UrlBase.Issues, "?status_id=", this.statusId, "&offset=", this.itemOffset, "&limit=", this.currentPageSize, assignedTo, createdOn, updatedOn);
        },
        buildTimeEntryUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntries);
        },
        buildTimeEntryActivitiesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntryActivities);
        },
        buildCurrentUserUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.CurrentUser);
        };
    return {
        withPageSize: withPageSize,
        getPageSize: getPageSize,
        withOffset: withOffset,
        getOffset: getOffset,
        withTaskAssignee: withTaskAssignee,
        getTaskAssignee: getTaskAssignee,
        withNextOffset: withNextOffset,
        resetDefault: resetDefault,
        withItemStatus: withItemStatus,
        getItemStatus : getItemStatus,
        withCreatedOn: withCreatedOn,
        withUpdatedOn: withUpdatedOn,
        buildIssuesUrl : buildIssuesUrl,
        buildTimeEntryUrl: buildTimeEntryUrl,
        buildTimeEntryActivitiesUrl: buildTimeEntryActivitiesUrl,
        buildCurrentUserUrl: buildCurrentUserUrl
    };
}());

UrlBuilder.createInstance = function (serviceBaseUrl) {
    return new UrlBuilder(serviceBaseUrl);
};

module.exports = UrlBuilder;
