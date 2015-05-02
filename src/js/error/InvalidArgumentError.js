var InvalidArgumentError = function (message) {
    "use strict";
    this.name = "InvalidArgumentError";
    this.message = (message || "");
};
InvalidArgumentError.prototype = Error.prototype;
module.exports = InvalidArgumentError;