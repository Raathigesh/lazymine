/*global require, expect, describe, it, beforeEach*/
var UrlBuilder = require('../src/js/stores/url-builder'),
    InvalidArgumentError = require('../src/js/error/invalid-argument-error'),
    ItemStatus = require("../src/js/constants/item-status"),
    moment = require("moment");

describe("URL Builder - construct", function () {
    "use strict";
    it("Should throw error when provided is not a URL", function () {
        var uri = "not a url";
        expect(function () {
            new UrlBuilder(uri);
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.");
    });

    it("Should contain default values initially", function () {
        var uri = "https://track.zone24x7.lk",
            builder = new UrlBuilder(uri);
        expect(builder.serviceBaseUrl).toBe(uri);
        expect(builder.getOffset()).toBe(0);
        expect(builder.getPageSize()).toBe(100);
        expect(builder.getItemStatus()).toBe(ItemStatus.New);
    });
});

describe("URL Builder - withPageSize", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter pageSize must be an integer between 1 and 100.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when called with none integer value", function () {
        expect(function () {
            builder.withPageSize();
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize(NaN);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize(null);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize("");
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize("test");
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize(new Date());
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize("1");
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should throw error when called with invalid page size", function () {
        expect(function () {
            builder.withPageSize(0);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize(101);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withPageSize(-1);
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should return self object with provided page size when page size is valid", function () {
        var pageSizeReturn = builder.withPageSize(1);
        expect(pageSizeReturn).toEqual(builder);
        expect(pageSizeReturn.getPageSize()).toEqual(1);

        pageSizeReturn = builder.withPageSize(100);
        expect(pageSizeReturn).toEqual(builder);
        expect(pageSizeReturn.getPageSize()).toEqual(100);

        pageSizeReturn = builder.withPageSize(50);
        expect(pageSizeReturn).toEqual(builder);
        expect(pageSizeReturn.getPageSize()).toEqual(50);
    });
});

describe("URL Builder - withOffset", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter offset must be an integer greater than or equal to 0.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when called with none integer value", function () {
        expect(function () {
            builder.withOffset();
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset(NaN);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset(null);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset("");
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset("test");
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset(new Date());
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withOffset("1");
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should throw error when called with invalid offset", function () {
        expect(function () {
            builder.withOffset(-1);
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should return self object with provided offset when offset is valid", function () {
        var offsetReturn = builder.withOffset(0);
        expect(offsetReturn).toEqual(builder);
        expect(builder.getOffset()).toBe(0);

        offsetReturn = builder.withOffset(1);
        expect(offsetReturn).toEqual(builder);
        expect(builder.getOffset()).toBe(1);

        offsetReturn = builder.withOffset(100);
        expect(offsetReturn).toEqual(builder);
        expect(builder.getOffset()).toBe(100);
    });
});

describe("URL Builder - withNextOffset", function () {
    "use strict";
    it("Should increase offset value on each call", function () {
        var uri = "https://track.zone24x7.lk",
            builder = new UrlBuilder(uri);
        expect(builder.getOffset()).toBe(0);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(100);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(200);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(300);
    });
});

describe("URL Builder - withItemStatus", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter statusId must be a property of ItemStatus.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when item status is invalid", function () {
        expect(function () {
            builder.withItemStatus(0);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withItemStatus(6);
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should set item status correctly when item status is valid", function () {
        var itemStatusReturn = builder.withItemStatus(ItemStatus.Closed);
        expect(itemStatusReturn).toEqual(builder);
        expect(itemStatusReturn.getItemStatus()).toEqual(ItemStatus.Closed);
    });
});

describe("URL Builder - withCreatedOn", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter createdOn must be a moment object.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when created on is not a moment object", function () {
        expect(function () {
            builder.withCreatedOn(null);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withCreatedOn("abc");
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should set created on correctly when created on is a moment object", function () {
        var momentObject = moment(),
            itemStatusReturn = builder.withCreatedOn(momentObject);
        expect(itemStatusReturn).toEqual(builder);
        expect(itemStatusReturn.createdOn).toEqual(momentObject);
    });
});

describe("URL Builder - withUpdatedOn", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter updatedOn must be a moment object.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when updated on is not a moment object", function () {
        expect(function () {
            builder.withUpdatedOn(null);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withUpdatedOn("abc");
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should set updated on correctly when updated on is a moment object", function () {
        var momentObject = moment(),
            itemStatusReturn = builder.withUpdatedOn(momentObject);
        expect(itemStatusReturn).toEqual(builder);
        expect(itemStatusReturn.updatedOn).toEqual(momentObject);
    });
});

describe("URL Builder - withSpentOn", function () {
    "use strict";
    var builder = null,
        errorMessage = "Parameter spentOn must be a moment object.";
    beforeEach(function () {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when spent on is not a moment object", function () {
        expect(function () {
            builder.withSpentOn(null);
        }).toThrowError(InvalidArgumentError, errorMessage);

        expect(function () {
            builder.withSpentOn("abc");
        }).toThrowError(InvalidArgumentError, errorMessage);
    });

    it("Should set spent on correctly when spent on is a moment object", function () {
        var momentObject = moment(),
            itemStatusReturn = builder.withSpentOn(momentObject);
        expect(itemStatusReturn).toEqual(builder);
        expect(itemStatusReturn.spentOn).toEqual(momentObject);
    });
});

describe("URL Builder - buildIssuesUrl", function () {
    "use strict";
    it("Should build issue URL correctly", function () {
        var uri = "https://track.zone24x7.lk",
            builder = new UrlBuilder(uri);

        expect(builder.buildIssuesUrl()).toEqual("https://track.zone24x7.lk/issues.json?status_id=1&offset=0&limit=100");
        expect(builder.withNextOffset().buildIssuesUrl()).toEqual("https://track.zone24x7.lk/issues.json?status_id=1&offset=100&limit=100");
    });
});

describe("URL Builder - buildTimeEntryUrl", function () {
    "use strict";
    it("Should build time entry URL correctly", function () {
        var uri = "https://track.zone24x7.lk",
            builder = new UrlBuilder(uri);

        expect(builder.buildTimeEntryUrl()).toEqual("https://track.zone24x7.lk/time_entries.json");
    });
});

describe("URL Builder - buildTimeEntryActivitiesUrl", function () {
    "use strict";
    it("Should build time entry activities URL correctly", function () {
        var uri = "https://track.zone24x7.lk",
            builder = new UrlBuilder(uri);

        expect(builder.buildTimeEntryActivitiesUrl()).toEqual("https://track.zone24x7.lk/enumerations/time_entry_activities.json");
    });
});