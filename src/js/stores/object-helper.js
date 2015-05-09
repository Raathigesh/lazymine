var ObjectHelper = function () {
};

ObjectHelper.prototype = (function () {
    var hasPropertyValue = function (type, value) {
            for(var prop in type) {
                if(type.hasOwnProperty(prop)) {
                    if(type[prop] === value) {
                        return true;
                    }
                }
            }

            return false;
        };
    return {
        hasPropertyValue: hasPropertyValue
    };
})();

module.exports = new ObjectHelper();
