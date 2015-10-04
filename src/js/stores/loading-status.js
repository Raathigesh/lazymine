var InvalidArgumentError = require("../error/invalid-argument-error");

var LoadingStatus = function(){
    "use strict";
    //possible values to contain... "fetchLatest", "spentTimes"
    this._loaders = [];
};
LoadingStatus.prototype = (function(){
    "use strict";
    var setLoading = function(loadingActionName){
        if(typeof loadingActionName !== "string"){
            throw new InvalidArgumentError("Parameter loadingActionName must be a string.");
        }
        this._loaders.push(loadingActionName);
    };
    var setLoaded = function(loadingActionName){
        if(typeof loadingActionName !== "string"){
            throw new InvalidArgumentError("Parameter loadingActionName must be a string.");
        }
        var index = this._loaders.indexOf(loadingActionName);
        if (index > -1) {
            this._loaders.splice(index, 1);
        }
    };
    var isLoading = function(){
        return this._loaders.length !== 0;
    };
    return {
        setLoading: setLoading,
        setLoaded: setLoaded,
        isLoading: isLoading
    };
}());

module.exports = LoadingStatus;