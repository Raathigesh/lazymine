var InvalidArgumentError = require("../error/InvalidArgumentError"),
    HttpHelper = require('./http-helper'),
    UrlBuilder = require('./url-builder'),
    $ = require("jquery");

var ServiceAccessor = function (urlBuilder, httpHelper) {
    "use strict";
    if(!(urlBuilder instanceof UrlBuilder)) {
        throw new InvalidArgumentError("Parameter urlBuilder must be instance of UrlBuilder");
    }

    if(!(httpHelper instanceof HttpHelper)) {
        throw new InvalidArgumentError("Parameter httpHelper must be instance of HttpHelper");
    }

    this.urlBuilder = urlBuilder;
    this.httpHelper = httpHelper;
    this.issues = [];
};

ServiceAccessor.prototype = (function () {
    "use strict";
    var getAllIssues = function (itemStatus, issueSuccessCallback, issueFailCallback) {
            var promises = [],
                index;

            var status = itemStatus.shift();
            this.urlBuilder.resetDefault().withItemStatus(status);
            var issuesUrl = this.urlBuilder.buildIssuesUrl();

            $.when(this.httpHelper.getRequest(issuesUrl)).done(function (data) {
                debugger;
                var totalRows = data.total_count,
                    totalPageCount = Math.ceil(totalRows / this.urlBuilder.getPageSize());

                this.issues = this.issues.concat(data.issues);
                if (totalPageCount > 1) {
                    debugger;
                    for (index = 2; index <= totalPageCount; index = index + 1) {
                        issuesUrl = this.urlBuilder.withNextOffset().buildIssuesUrl();
                        promises.push(this.httpHelper.getRequest(issuesUrl));
                    }

                    $.when.apply($, promises).done(function () {
                        debugger;
                        for (index = 0; index < arguments.length; index = index + 1) {
                            this.issues = this.issues.concat(arguments[index][0].issues);
                        }

                        if(itemStatus.length > 0) {
                            getAllIssues.call(this, itemStatus, issueSuccessCallback)
                        }
                        else{
                            issueSuccessCallback(this.issues);
                        }
                    }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                        issueFailCallback(jqXHR, textStatus, errorThrown);
                    }.bind(this));
                } else {
                    if(itemStatus.length > 0) {
                        getAllIssues.call(this, itemStatus, issueSuccessCallback)
                    }
                    else{
                        issueSuccessCallback(this.issues);
                    }
                }
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                issueFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        },
        createTimeEntries = function (issues, timeEntrySuccessCallback, timeEntryFailCallback) {
            var promises = [],
                timeEntryUrl = this.urlBuilder.buildTimeEntryUrl();

            for (index = 0; index < issues.length; index = index + 1) {
                promises.push(this.httpHelper.postRequest(timeEntryUrl, issues[0]));
            }

            $.when.apply($, promises).done(function (data) {
                timeEntrySuccessCallback(true);
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                timeEntryFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        },
        getTimeEntryActivities = function (activitySuccessCallback, activityFailCallback) {
            var TimeEntryActivitiesUrl = this.urlBuilder.buildTimeEntryActivitiesUrl();
            $.when(this.httpHelper.getRequest(TimeEntryActivitiesUrl)).done(function (response) {
                activitySuccessCallback(response);
            }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
                activityFailCallback(jqXHR, textStatus, errorThrown);
            }.bind(this));
        };
    return {
        getAllIssues: getAllIssues,
        createTimeEntries: createTimeEntries,
        getTimeEntryActivities: getTimeEntryActivities
    };
}());

module.exports = ServiceAccessor;
