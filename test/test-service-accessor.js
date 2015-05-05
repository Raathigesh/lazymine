var ServiceAccessor = require('../src/js/stores/service-accessor');

describe("HTTP Helper - construct", function() {
    it("Should throw error when provided API key is not provided", function() {
        expect(function() {
            new HttpHelper(12)
        }).toThrowError(InvalidArgumentError, "Parameter apiKey must be a none empty string.");

        expect(function() {
            new HttpHelper("")
        }).toThrowError(InvalidArgumentError, "Parameter apiKey must be a none empty string.");
    });
});