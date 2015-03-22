var UrlBase = {
    Issues : "issues.json"
};

var UrlBuilder = function (serviceBaseUrl, pageSize, pageNumber) {
    "use strict";
    this.serviceBaseUrl = serviceBaseUrl;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    
};

UrlBuilder.prototype = (function () {
    "use strict";
    var withPageSize = function (pageSize) {
            this.pageSize = pageSize;
            return this;
        },
        withPageNo = function (pageNumber) {
            this.pageNumber = pageNumber;
            return this;
        },
        buildUrl = function (requestBase) {
            return this.serviceBaseUrl.concat("/", requestBase, "?offset=", this.pageNumber, "?limit=", this.pageSize);
        },
        buildIssuesUrl = function () {
            return buildUrl.call(this, UrlBase.Issues);
        };
    return {
        withPageSize: withPageSize,
        withPageNo: withPageNo,
        buildIssuesUrl: buildIssuesUrl
    };
}());

module.exports = UrlBuilder;