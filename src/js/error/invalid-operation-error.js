/*global module*/
var InvalidOperationError = function (message) {
    "use strict";
    this.name = "InvalidOperationError";
    this.message = (message || "");
};
InvalidOperationError.prototype = Error.prototype;
module.exports = InvalidOperationError;
