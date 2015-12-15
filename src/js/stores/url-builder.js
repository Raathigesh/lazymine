/*global require, module*/
var validator = require("validator"),
    InvalidArgumentError = require("../error/invalid-argument-error"),
    InvalidOperationError = require("../error/invalid-operation-error"),
    ItemStatus = require("../constants/item-status"),
    objectHelper = require("./object-helper"),
    _ = require("lodash"),
    moment = require("moment");

var UrlBase = {
    Issues : "/issues.json",
    TimeEntries: "/time_entries.json",
    TimeEntryActivities: "/enumerations/time_entry_activities.json",
    CurrentUser: "/users/current.json"
};

var UrlBuilder = function (serviceBaseUrl) {
    "use strict";
    if (!validator.isURL(serviceBaseUrl)) {
        throw new InvalidArgumentError("Parameter url must be a URL.");
    }

    this.serviceBaseUrl = serviceBaseUrl;
    this.statusId = ItemStatus.New;
    this.currentPageSize = 100;
    this.itemOffset = 0;
    this.createdOn = null;
    this.updatedOn = null;
    this.spentOn = null;
    this.timeEntryId = null;
};

UrlBuilder.prototype = (function () {
    "use strict";
    var dateFormat = "YYYY-MM-DD",
        getPageSize = function () {
            return this.currentPageSize;
        },
        getOffset = function () {
            return this.itemOffset;
        },
        getItemStatus = function () {
            return this.statusId;
        },
        getCreatedOnUrlSegment = function () {
            return this.createdOn ? "&created_on=><" + this.createdOn.format(dateFormat) + "|" + moment().format(dateFormat) : "";
        },
        getUpdatedOnUrlSegment = function () {
            return this.updatedOn ? "&updated_on=><" + this.updatedOn.format(dateFormat) + "|" + moment().format(dateFormat) : "";
        },
        withPageSize = function (pageSize) {
            if (!_.isNumber(pageSize) || !validator.isInt(pageSize, { min: 1, max: 100 })) {
                throw new InvalidArgumentError("Parameter pageSize must be an integer between 1 and 100.");
            }

            this.currentPageSize = pageSize;
            return this;
        },
        withOffset = function (offset) {
            if (!_.isNumber(offset) || !validator.isInt(offset, { min: 0 })) {
                throw new InvalidArgumentError("Parameter offset must be an integer greater than or equal to 0.");
            }

            this.itemOffset = offset;
            return this;
        },
        withNextOffset = function () {
            this.itemOffset = this.itemOffset + this.currentPageSize;
            return this;
        },
        withItemStatus = function (status) {
            if (!objectHelper.hasPropertyValue(ItemStatus, status)) {
                throw new InvalidArgumentError("Parameter statusId must be a property of ItemStatus.");
            }

            this.statusId = status;
            return this;
        },
        withCreatedOn = function (createdOn) {
            if (!createdOn || !createdOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter createdOn must be a moment object.");
            }

            this.createdOn = createdOn;
            return this;
        },
        withUpdatedOn = function (updatedOn) {
            if (!updatedOn || !updatedOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter updatedOn must be a moment object.");
            }

            this.updatedOn = updatedOn;
            return this;
        },
        withSpentOn = function (spentOn) {
            if (!spentOn || !spentOn._isAMomentObject) {
                throw new InvalidArgumentError("Parameter spentOn must be a moment object.");
            }

            this.spentOn = spentOn;
            return this;
        },
        withTimeEntryId = function (timeEntryId) {
            if (!_.isNumber(timeEntryId)) {
                throw new InvalidArgumentError("Parameter timeEntryId must be a number.");
            }

            this.timeEntryId = timeEntryId;
            return this;
        },
        buildIssuesUrl = function () {
            var createdOn = getCreatedOnUrlSegment.call(this),
                updatedOn = getUpdatedOnUrlSegment.call(this);
            return this.serviceBaseUrl.concat(UrlBase.Issues, "?status_id=", this.statusId, "&offset=", this.itemOffset, "&limit=", this.currentPageSize, createdOn, updatedOn);
        },
        buildTimeEntryUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntries);
        },
        buildUpdatedTimeEntriesUrl = function () {
            if (this.spentOn === null) {
                throw new InvalidOperationError("Must set spentOn before calling buildUpdatedTimeEntriesUrl.");
            }

            return this.serviceBaseUrl.concat(UrlBase.TimeEntries, "?user_id=me&spent_on=", this.spentOn.format(dateFormat));
        },
        buildTimeEntryActivitiesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntryActivities);
        },
        buildCurrentUserUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.CurrentUser);
        },
        buildTimeEntryDeleteUrl = function () {
            return this.serviceBaseUrl.concat('/time_entries/' + this.timeEntryId + '.json');
        },
        resetDefault = function () {
            this.statusId = ItemStatus.New;
            this.currentPageSize = 100;
            this.itemOffset = 0;
            this.createdOn = null;
            this.updatedOn = null;
            this.spentOn = null;
            return this;
        };
    return {
        getPageSize: getPageSize,
        getItemStatus : getItemStatus,
        getOffset: getOffset,
        withPageSize: withPageSize,
        withOffset: withOffset,
        withNextOffset: withNextOffset,
        withItemStatus: withItemStatus,
        withCreatedOn: withCreatedOn,
        withUpdatedOn: withUpdatedOn,
        withSpentOn: withSpentOn,
        withTimeEntryId: withTimeEntryId,
        resetDefault: resetDefault,
        buildIssuesUrl : buildIssuesUrl,
        buildTimeEntryUrl: buildTimeEntryUrl,
        buildUpdatedTimeEntriesUrl: buildUpdatedTimeEntriesUrl,
        buildTimeEntryActivitiesUrl: buildTimeEntryActivitiesUrl,
        buildCurrentUserUrl: buildCurrentUserUrl,
        buildTimeEntryDeleteUrl: buildTimeEntryDeleteUrl
    };
}());

UrlBuilder.createInstance = function (serviceBaseUrl) {
    "use strict";
    return new UrlBuilder(serviceBaseUrl);
};

module.exports = UrlBuilder;
