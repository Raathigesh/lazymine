var UrlBase = {
    Issues : "/issues.json",
    TimeEntries: "/time_entries.json",
    TimeEntryActivities: "/enumerations/time_entry_activities.json"
};

var UrlBuilder = function (serviceBaseUrl) {
    "use strict";
    this.serviceBaseUrl = serviceBaseUrl;
    this.currentPageSize = 100.0;
    this.offset = 0;
};

UrlBuilder.prototype = (function () {
    "use strict";
    var withPageSize = function (pageSize) {
            this.currentPageSize = pageSize;
            return this;
        },
        withOffset = function (offset) {
            this.offset = offset;
            return this;
        },
        withNextOffset = function () {
            this.offset = this.offset + this.currentPageSize;
            return this;
        },
        buildIssuesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.Issues, "?status_id=2&offset=", this.offset, "&limit=", this.currentPageSize);
        },
        buildTimeEntryUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntries);
        },
        buildTimeEntryActivitiesUrl = function () {
            return this.serviceBaseUrl.concat(UrlBase.TimeEntryActivities);
        };
    return {
        withPageSize: withPageSize,
        withOffset: withOffset,
        withNextOffset: withNextOffset,
        buildTimeEntryUrl: buildTimeEntryUrl,
        buildTimeEntryActivitiesUrl: buildTimeEntryActivitiesUrl
    };
}());

module.exports = UrlBuilder;