var UrlBase = {
    Issues : "issues.json"
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
        buildUrl = function (requestBase) {
            return this.serviceBaseUrl.concat("/", requestBase, "?offset=", this.offset, "&limit=", this.currentPageSize);
        },
        buildIssuesUrl = function () {
            return buildUrl.call(this, UrlBase.Issues);
        };
    return {
        withPageSize: withPageSize,
        withOffset: withOffset,
        withNextOffset: withNextOffset,
        buildIssuesUrl: buildIssuesUrl
    };
}());

module.exports = UrlBuilder;