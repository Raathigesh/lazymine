var GoogleAnalytics = function(){
    "user strict";
    ga_storage._setAccount('UA-65441617-1');
    ga_storage._setDomain('none');
};

GoogleAnalytics.prototype = (function(){
    "use strict";
    var trackPageView = function(relativeURL){
        ga_storage._trackPageview(relativeURL);
    };
    return {
        trackPageView: trackPageView
    };
}());

module.exports = GoogleAnalytics;