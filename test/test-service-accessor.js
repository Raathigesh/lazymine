var ServiceAccessor = require('../src/js/stores/service-accessor'),
    HttpHelper = require('../src/js/stores/http-helper'),
    UrlBuilder = require('../src/js/stores/url-builder'),
    $ = require("jquery");

describe("Service Accessor - getTimeEntryActivities", function() {
    var serviceAccessor = null,
        fakeUrl = "https://track.zone24x7.lk/",
        fakeData = "fake data",
        fakeHttpHelper = new HttpHelper("fake api key"),
        fakeUrlBuilder = new UrlBuilder(fakeUrl),
        successCallback = null,
        failCallback = null;

    beforeEach(function() {
        spyOn(UrlBuilder, "createInstance").and.callFake(function (){
            return fakeUrlBuilder;
        });
        serviceAccessor = new ServiceAccessor(fakeUrl, fakeHttpHelper);

        successCallback = jasmine.createSpy('successCallback');
        failCallback = jasmine.createSpy('failCallback');
    });

    it("Should call success callback when promise is resolved", function() {
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
});