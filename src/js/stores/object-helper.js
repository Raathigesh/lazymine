/*global module*/
var ObjectHelper = function () {
    "use strict";
};

ObjectHelper.prototype = (function () {
    "use strict";
    var hasPropertyValue = function (type, value) {
            var prop;
            for (prop in type) {
                if (type.hasOwnProperty(prop)) {
                    if (type[prop] === value) {
                        return true;
                    }
                }
            }

            return false;
        };
    return {
        hasPropertyValue: hasPropertyValue
    };
}());

module.exports = new ObjectHelper();
