var UrlBuilder = require('../src/js/stores/url-builder'),
    InvalidArgumentError = require('../src/js/error/InvalidArgumentError'),
    ItemStatus = require("../src/js/constants/item-status");

describe("URL Builder - construct", function() {
    it("Should throw error when provided is not a URL", function() {
        var uri = "not a url";
        expect(function() {
            new UrlBuilder(uri)
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.")
    });

    it("Should contain default values initially", function() {
        var uri = "https://track.zone24x7.lk";
        var builder = new UrlBuilder(uri);
        expect(builder.serviceBaseUrl).toBe(uri);
        expect(builder.getOffset()).toBe(0);
        expect(builder.getPageSize()).toBe(100);
        expect(builder.getItemStatus()).toBe(ItemStatus.New);
    });
});

describe("URL Builder - withPageSize", function() {
    var builder;
    beforeEach(function() {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when called with none numeric value", function() {
        expect(function() {
            builder.withPageSize(null);
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be a number.");

        expect(function() {
            builder.withPageSize("");
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be a number.");

        expect(function() {
            builder.withPageSize("test");
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be a number.");

        expect(function() {
            builder.withPageSize(new Date());
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be a number.")
    });

    it("Should throw error when called with invalid page size", function() {
        expect(function() {
            builder.withPageSize(0);
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be between 1 and 100.");

        expect(function() {
            builder.withPageSize(101);
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be between 1 and 100.");

        expect(function() {
            builder.withPageSize(-1);
        }).toThrowError(InvalidArgumentError, "Parameter pageSize must be between 1 and 100.");
    });

    it("Should return self object with provided page size when page size is valid", function() {
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

describe("URL Builder - withOffset", function() {
    var builder;
    beforeEach(function() {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when called with none offset", function() {
        expect(function() {
            builder.withOffset(null);
        }).toThrowError(InvalidArgumentError, "Parameter offset must be a number.");

        expect(function() {
            builder.withOffset("");
        }).toThrowError(InvalidArgumentError, "Parameter offset must be a number.");

        expect(function() {
            builder.withOffset("test");
        }).toThrowError(InvalidArgumentError, "Parameter offset must be a number.");

        expect(function() {
            builder.withOffset(new Date());
        }).toThrowError(InvalidArgumentError, "Parameter offset must be a number.")
    });

    it("Should throw error when called with invalid offset", function() {
        expect(function() {
            builder.withOffset(-1);
        }).toThrowError(InvalidArgumentError, "Parameter offset must be greater than 0.");
    });

    it("Should return self object with provided offset when offset is valid", function() {
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

describe("URL Builder - withNextOffset", function() {
    it("Should increase offset value on each call", function() {
        var uri = "https://track.zone24x7.lk";
        var builder = new UrlBuilder(uri);
        expect(builder.getOffset()).toBe(0);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(100);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(200);

        expect(builder.withNextOffset()).toEqual(builder);
        expect(builder.getOffset()).toBe(300);
    });
});

describe("URL Builder - buildIssuesUrl", function() {
    it("Should build issue URL correctly", function() {
        var uri = "https://track.zone24x7.lk";
        var builder = new UrlBuilder(uri);

        expect(builder.buildIssuesUrl()).toEqual("https://track.zone24x7.lk/issues.json?status_id=1&offset=0&limit=100");
        expect(builder.withNextOffset().buildIssuesUrl()).toEqual("https://track.zone24x7.lk/issues.json?status_id=1&offset=100&limit=100");
    });
});

describe("URL Builder - buildTimeEntryUrl", function() {
    it("Should build time entry URL correctly", function() {
        var uri = "https://track.zone24x7.lk";
        var builder = new UrlBuilder(uri);

        expect(builder.buildTimeEntryUrl()).toEqual("https://track.zone24x7.lk/time_entries.json");
    });
});

describe("URL Builder - buildTimeEntryActivitiesUrl", function() {
    it("Should build time entry activities URL correctly", function() {
        var uri = "https://track.zone24x7.lk";
        var builder = new UrlBuilder(uri);

        expect(builder.buildTimeEntryActivitiesUrl()).toEqual("https://track.zone24x7.lk/enumerations/time_entry_activities.json");
    });
});

describe("URL Builder - setItemStatus", function() {
    var builder;
    beforeEach(function() {
        var uri = "https://track.zone24x7.lk";
        builder = new UrlBuilder(uri);
    });

    it("Should throw error when item status is invalid", function() {
        expect(function () {
            builder.withItemStatus(0);
        }).toThrowError(InvalidArgumentError, "Parameter statusId must be a property of ItemStatus.");

        expect(function () {
            builder.withItemStatus(6);
        }).toThrowError(InvalidArgumentError, "Parameter statusId must be a property of ItemStatus.");
    });

    it("Should set item status correctly when item status is valid", function() {
        var itemStatusReturn = builder.withItemStatus(ItemStatus.Closed);
        expect(itemStatusReturn).toEqual(builder);
        expect(itemStatusReturn.getItemStatus()).toEqual(ItemStatus.Closed);
    });
});