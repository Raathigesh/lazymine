/*global require, expect, describe, it, beforeEach, spyOn, jasmine*/
var LoadingStatus = require('../src/js/stores/loading-status'),
    InvalidArgumentError = require('../src/js/error/invalid-argument-error');

describe("Loading Status - construct", function () {
    it("Should throw error when LoadingActionName is not provided",function(){
        expect(function(){
            var loadingStatus = new LoadingStatus();
            loadingStatus.setLoading();
        }).toThrowError(InvalidArgumentError, "Parameter loadingActionName must be a string.");
    });
});

describe("Loading Status - isLoading", function(){
    it("Should return false when object created",function(){
        var loadingStatus = new LoadingStatus();
        expect(loadingStatus.isLoading()).toBe(false);
    })
    it("Should return true when setLoading called once",function(){
        var loadingStatus = new LoadingStatus();
        loadingStatus.setLoading("fetchLatest");
        expect(loadingStatus.isLoading()).toBe(true);
    });
    it("Should return false then setLoading and setLoaded called",function(){
        debugger;
        var loadingStatus = new LoadingStatus();
        loadingStatus.setLoading("fetchLatest");
        loadingStatus.setLoaded("fetchLatest");
        var loading = loadingStatus.isLoading();
        expect(loading).toBe(false);
    })
    it("Should return true when setLoading, setLoaded and the setLoading called",function(){
        var loadingStatus = new LoadingStatus();
        loadingStatus.setLoading("fetchLatest");
        loadingStatus.setLoaded("fetchLatest");
        loadingStatus.setLoading("spentTimes");
        expect(loadingStatus.isLoading()).toBe(true);
    })
});
