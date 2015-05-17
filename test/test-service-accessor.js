/*global require, expect, describe, it, beforeEach, spyOn, jasmine*/
var ServiceAccessor = require('../src/js/stores/service-accessor'),
    HttpHelper = require('../src/js/stores/http-helper'),
    UrlBuilder = require('../src/js/stores/url-builder'),
    ItemStatus = require("../src/js/constants/item-status"),
    InvalidArgumentError = require('../src/js/error/invalid-argument-error'),
    $ = require("jquery");

describe("Service Accessor - constructor", function () {
    "use strict";
    it("Should throw error when provided service base is not a URL", function () {
        var uri = "not a url";
        expect(function () {
            new ServiceAccessor(uri, null);
        }).toThrowError(InvalidArgumentError, "Parameter serviceBaseUrl must be a URL.");
    });

    it("Should throw error when provided http helper is not an instance of HttpHelper", function () {
        var uri = "https://track.zone24x7.lk/";
        expect(function () {
            new ServiceAccessor(uri, null);
        }).toThrowError(InvalidArgumentError, "Parameter httpHelper must be an instance of HttpHelper.");
    });

    it("Should not throw exceptions when parameters are valid", function () {
        var uri = "https://track.zone24x7.lk/",
            httpHelper = new HttpHelper("fake api key"),
            serviceAccessor = new ServiceAccessor(uri, httpHelper);

        expect(serviceAccessor.serviceBaseUrl).toEqual(uri);
        expect(serviceAccessor.httpHelper).toEqual(httpHelper);
        expect(serviceAccessor.taskStatusCollection).toEqual(jasmine.objectContaining([
            ItemStatus.InProgress,
            ItemStatus.New,
            ItemStatus.ReOpened
        ]));
    });
});

describe("Service Accessor - getTimeEntryActivities", function () {
    "use strict";
    var serviceAccessor = null,
        fakeUrl = "https://track.zone24x7.lk/",
        fakeData = "fake data",
        fakeHttpHelper = new HttpHelper("fake api key"),
        fakeUrlBuilder = new UrlBuilder(fakeUrl),
        successCallback = null,
        failCallback = null;

    beforeEach(function () {
        spyOn(UrlBuilder, "createInstance").and.callFake(function () {
            return fakeUrlBuilder;
        });
        serviceAccessor = new ServiceAccessor(fakeUrl, fakeHttpHelper);

        successCallback = jasmine.createSpy('successCallback');
        failCallback = jasmine.createSpy('failCallback');
    });

    it("Should call success callback when promise is resolved", function () {
        spyOn(fakeUrlBuilder, 'buildTimeEntryActivitiesUrl').and.callFake(function () {
            return fakeUrl;
        });
        spyOn(fakeHttpHelper, 'getRequest').and.callFake(function () {
            var deferred = $.Deferred();
            deferred.resolve(fakeData);
            return deferred.promise();
        });

        serviceAccessor.getTimeEntryActivities(successCallback, failCallback);

        expect(UrlBuilder.createInstance).toHaveBeenCalledWith(fakeUrl);
        expect(successCallback).toHaveBeenCalledWith(fakeData);
        expect(failCallback).not.toHaveBeenCalled();
    });

    it("Should call fail callback when promise is reject", function () {
        spyOn(fakeUrlBuilder, 'buildTimeEntryActivitiesUrl').and.callFake(function () {
            return fakeUrl;
        });
        spyOn(fakeHttpHelper, 'getRequest').and.callFake(function () {
            var deferred = $.Deferred();
            deferred.reject(fakeData);
            return deferred.promise();
        });

        serviceAccessor.getTimeEntryActivities(successCallback, failCallback);

        expect(UrlBuilder.createInstance).toHaveBeenCalledWith(fakeUrl);
        expect(successCallback).not.toHaveBeenCalled();
        expect(failCallback).toHaveBeenCalled();
    });

    it("Should throw error when success callback is not a function", function () {
        expect(function () {
            serviceAccessor.getTimeEntryActivities(null, null);
        }).toThrowError(InvalidArgumentError, "Parameter activitySuccessCallback must be a function.");
    });

    it("Should throw error when fail callback is not a function", function () {
        expect(function () {
            serviceAccessor.getTimeEntryActivities(function () {}, null);
        }).toThrowError(InvalidArgumentError, "Parameter activityFailCallback must be a function.");
    });
});

describe("Service Accessor - createTimeEntries", function () {
    "use strict";
    var serviceAccessor = null,
        fakeUrl = "https://track.zone24x7.lk/",
        fakeData = "fake data",
        fakeHttpHelper = new HttpHelper("fake api key"),
        fakeUrlBuilder = new UrlBuilder(fakeUrl),
        successCallback = null,
        failCallback = null;

    beforeEach(function () {
        spyOn(UrlBuilder, "createInstance").and.callFake(function () {
            return fakeUrlBuilder;
        });
        serviceAccessor = new ServiceAccessor(fakeUrl, fakeHttpHelper);

        successCallback = jasmine.createSpy('successCallback');
        failCallback = jasmine.createSpy('failCallback');
    });

    it("Should call success callback when promise is resolved", function () {
        spyOn(fakeUrlBuilder, 'buildTimeEntryActivitiesUrl').and.callFake(function () {
            return fakeUrl;
        });
        spyOn(fakeHttpHelper, 'getRequest').and.callFake(function () {
            var deferred = $.Deferred();
            deferred.resolve(fakeData);
            return deferred.promise();
        });

        serviceAccessor.getTimeEntryActivities(successCallback, failCallback);

        expect(UrlBuilder.createInstance).toHaveBeenCalledWith(fakeUrl);
        expect(successCallback).toHaveBeenCalledWith(fakeData);
        expect(failCallback).not.toHaveBeenCalled();
    });

    it("Should call fail callback when promise is reject", function () {
        spyOn(fakeUrlBuilder, 'buildTimeEntryActivitiesUrl').and.callFake(function () {
            return fakeUrl;
        });
        spyOn(fakeHttpHelper, 'getRequest').and.callFake(function () {
            var deferred = $.Deferred();
            deferred.reject(fakeData);
            return deferred.promise();
        });

        serviceAccessor.getTimeEntryActivities(successCallback, failCallback);

        expect(UrlBuilder.createInstance).toHaveBeenCalledWith(fakeUrl);
        expect(successCallback).not.toHaveBeenCalled();
        expect(failCallback).toHaveBeenCalled();
    });

    it("Should throw error when success callback is not a function", function () {
        expect(function () {
            serviceAccessor.createTimeEntries(null, null, null);
        }).toThrowError(InvalidArgumentError, "Parameter timeEntrySuccessCallback must be a function.");
    });

    it("Should throw error when fail callback is not a function", function () {
        expect(function () {
            serviceAccessor.createTimeEntries(null, function () {}, null);
        }).toThrowError(InvalidArgumentError, "Parameter timeEntryFailCallback must be a function.");
    });
});