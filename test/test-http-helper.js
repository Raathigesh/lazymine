var HttpHelper = require('../src/js/stores/HttpHelper'),
    InvalidArgumentError = require('../src/js/error/InvalidArgumentError'),
    $ = require("jquery");

describe("HTTP Helper - construct", function() {
    it("Should throw error when provided API key is not provided", function() {
        expect(function() {
            new HttpHelper(12)
        }).toThrowError(InvalidArgumentError, "Parameter apiKey must be a none empty string.");

        expect(function() {
            new HttpHelper("")
        }).toThrowError(InvalidArgumentError, "Parameter apiKey must be a none empty string.");
    });

    it("Should contain provided value initially", function() {
        var apiKey = "my api key";
        var helper = new HttpHelper(apiKey);
        expect(helper.apiKey).toBe(apiKey);
    });
});

describe("HTTP Helper - getRequest", function() {
    var helper,
        apiKey = "my api key";
    beforeEach(function() {
        helper = new HttpHelper(apiKey);
        spyOn($, 'ajax').and.callFake(function (){});
    });

    it("Should throw error when provided url is not a URL", function() {
        expect(function() {
            helper.getRequest("");
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.");

        expect(function() {
            helper.getRequest(123);
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.");
    });

    it("Should call jquery ajax with appropriate parameters", function() {
        var url = "https://track.zone24x7.lk";
        helper.getRequest(url);
        expect($.ajax.calls.argsFor(0)).toEqual([jasmine.objectContaining({
            type: "GET",
            url: url,
            contentType : "application/json",
            crossDomain: true,
            dataType: 'json',
            async: true,
            headers: {
                "X-Redmine-API-Key": apiKey
            }
        })]);
    });
});

describe("HTTP Helper - postRequest", function() {
    var helper,
        apiKey = "my api key";
    beforeEach(function() {
        helper = new HttpHelper(apiKey);
        spyOn($, 'ajax').and.callFake(function (){});
    });

    it("Should throw error when provided url is not a URL", function() {
        expect(function() {
            helper.postRequest("", {});
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.");

        expect(function() {
            helper.postRequest(123, {});
        }).toThrowError(InvalidArgumentError, "Parameter url must be a URL.");
    });

    it("Should throw error when provided data is not an object", function() {
        var url = "https://track.zone24x7.lk";
        expect(function() {
            helper.postRequest(url, "abc");
        }).toThrowError(InvalidArgumentError, "Parameter data must be an object.");

        expect(function() {
            helper.postRequest(url, 123);
        }).toThrowError(InvalidArgumentError, "Parameter data must be an object.");
    });

    it("Should call jquery ajax with appropriate parameters", function() {
        var url = "https://track.zone24x7.lk",
            data = {};
        helper.postRequest(url, {});
        expect($.ajax.calls.argsFor(0)).toEqual([jasmine.objectContaining({
            type: "POST",
            url: url,
            contentType : "application/json",
            crossDomain: true,
            dataType: 'json',
            async: true,
            data: JSON.stringify(data),
            headers: {
                "X-Redmine-API-Key": apiKey
            }
        })]);
    });
});